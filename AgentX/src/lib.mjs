#!/usr/bin/env node

// ============================================================================
// ОБЩАЯ БИБЛИОТЕКА УТИЛИТ ДЛЯ ПРОЕКТА HIVE-MIND
// ============================================================================
// Этот модуль содержит вспомогательные функции, используемые во всем проекте:
// - Логирование (в консоль и файл)
// - Форматирование данных (токены, байты, время)
// - Обработка ошибок и retry-логика
// - Работа с файловой системой
// ============================================================================

// ----------------------------------------------------------------------------
// ИНИЦИАЛИЗАЦИЯ SENTRY ДЛЯ ОТСЛЕЖИВАНИЯ ОШИБОК
// ----------------------------------------------------------------------------
// Пытаемся импортировать модуль Sentry для мониторинга ошибок в продакшене.
// Если модуль недоступен (например, @sentry/node не установлен), создаём
// заглушки (no-op функции), чтобы не ломать работу приложения.
let reportError = null;    // Функция для отправки ошибок в Sentry
let reportWarning = null;  // Функция для отправки предупреждений в Sentry

try {
  // Динамический импорт модуля Sentry
  const sentryModule = await import('./sentry.lib.mjs');
  reportError = sentryModule.reportError;
  reportWarning = sentryModule.reportWarning;
} catch (_error) {
  // Модуль Sentry недоступен — создаём заглушки
  if (global.verboseMode) {
    console.debug('Sentry module not available:', _error?.message || 'Import failed');
  }

  // Заглушка для reportError — просто выводит в консоль в verbose режиме
  reportError = (err) => {
    if (global.verboseMode) {
      console.debug('Sentry not available for error reporting:', err?.message);
    }
  };

  // Заглушка для reportWarning — тоже только консоль в verbose режиме
  reportWarning = () => {
    if (global.verboseMode) {
      console.debug('Sentry not available for warning reporting');
    }
  };
}

// ----------------------------------------------------------------------------
// ДИНАМИЧЕСКАЯ ЗАГРУЗКА МОДУЛЕЙ ЧЕРЕЗ USE-M
// ----------------------------------------------------------------------------
// use-m — это утилита для динамической загрузки Node.js модулей без package.json.
// Проверяем, определён ли уже globalThis.use (если импортируем из solve.mjs),
// если нет — загружаем его с CDN unpkg.com для standalone режима.
if (typeof globalThis.use === 'undefined') {
  globalThis.use = (await eval(await (await fetch('https://unpkg.com/use-m/use.js')).text())).use;
}

// Загружаем модуль fs (файловая система) с промисами для async/await
const fs = (await use('fs')).promises;

// ----------------------------------------------------------------------------
// УПРАВЛЕНИЕ ЛОГ-ФАЙЛОМ
// ----------------------------------------------------------------------------
// Глобальная переменная для хранения пути к текущему лог-файлу.
// Может быть установлена импортирующим модулем через setLogFile().
export let logFile = null;

/**
 * УСТАНОВИТЬ ПУТЬ К ЛОГ-ФАЙЛУ
 * Сохраняет путь к файлу, куда будут записываться все логи.
 * @param {string} path - Путь к лог-файлу
 */
export const setLogFile = (path) => {
  logFile = path;
};

/**
 * ПОЛУЧИТЬ ТЕКУЩИЙ ПУТЬ К ЛОГ-ФАЙЛУ
 * Возвращает путь к активному лог-файлу или null, если не установлен.
 * @returns {string|null} Текущий путь к лог-файлу или null
 */
export const getLogFile = () => {
  return logFile;
};

/**
 * ПОЛУЧИТЬ АБСОЛЮТНЫЙ ПУТЬ К ЛОГ-ФАЙЛУ
 * Преобразует относительный путь в абсолютный для отображения пользователю.
 * @returns {Promise<string|null>} Абсолютный путь к лог-файлу или null
 */
export const getAbsoluteLogPath = async () => {
  if (!logFile) return null;
  const path = (await use('path'));
  return path.resolve(logFile);
};

/**
 * УНИВЕРСАЛЬНАЯ ФУНКЦИЯ ЛОГИРОВАНИЯ
 * ====================================
 * Записывает сообщения одновременно в консоль И в файл.
 * Это основная функция логирования, используемая во всём проекте.
 *
 * Особенности:
 * - Автоматически добавляет timestamp и уровень в лог-файл
 * - Поддерживает verbose-режим (подробные логи только с флагом --verbose)
 * - Использует правильные потоки консоли (error/warn/log)
 * - Обрабатывает ошибки записи без падения приложения
 *
 * @param {string} message - Сообщение для логирования
 * @param {Object} options - Опции логирования
 * @param {string} [options.level='info'] - Уровень лога (info, warn, error)
 * @param {boolean} [options.verbose=false] - Verbose-лог (показывается только с --verbose)
 * @returns {Promise<void>}
 */
export const log = async (message, options = {}) => {
  const { level = 'info', verbose = false } = options;

  // Пропускаем verbose-логи, если не включён режим --verbose
  // Это позволяет делать детальное логирование без засорения консоли
  if (verbose && !global.verboseMode) {
    return;
  }

  // Запись в файл (если лог-файл установлен)
  if (logFile) {
    // Формат: [2025-11-27T04:20:15.123Z] [INFO] Сообщение
    const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;

    // Пытаемся записать в файл, но не падаем если не получилось
    await fs.appendFile(logFile, logMessage + '\n').catch((error) => {
      // Тихий fail чтобы избежать бесконечного цикла логирования ошибок логирования
      // Но в verbose-режиме отправляем в Sentry для диагностики
      if (global.verboseMode) {
        reportError(error, {
          context: 'log_file_append',
          level: 'debug',
          logFile
        });
      }
    });
  }

  // Запись в консоль с использованием правильного потока
  switch (level) {
    case 'error':
      console.error(message);  // stderr - для ошибок
      break;
    case 'warning':
    case 'warn':
      console.warn(message);   // stderr - для предупреждений
      break;
    case 'info':
    default:
      console.log(message);    // stdout - для информации
      break;
  }
};

/**
 * МАСКИРОВКА ЧУВСТВИТЕЛЬНЫХ ТОКЕНОВ
 * ===================================
 * Скрывает API-ключи, токены и пароли в логах для безопасности.
 * Показывает только начало и конец, середину заменяет звёздочками.
 *
 * Пример:
 *   maskToken('sk-ant-1234567890abcdef')
 *   → 'sk-an***************cdef'
 *
 * Зачем: Избегаем утечки токенов в логах, GitHub Issues, Sentry.
 *
 * @param {string} token - Токен для маскировки
 * @param {Object} options - Опции маскировки
 * @param {number} [options.minLength=12] - Минимальная длина для маскировки
 * @param {number} [options.startChars=5] - Сколько символов показать в начале
 * @param {number} [options.endChars=5] - Сколько символов показать в конце
 * @returns {string} Замаскированный токен
 */
export const maskToken = (token, options = {}) => {
  const { minLength = 12, startChars = 5, endChars = 5 } = options;

  // Не маскируем очень короткие строки (скорее всего это не секреты)
  if (!token || token.length < minLength) {
    return token;
  }

  // Берём начало и конец токена
  const start = token.substring(0, startChars);
  const end = token.substring(token.length - endChars);

  // Середину заменяем звёздочками (минимум 3 звёздочки)
  const middle = '*'.repeat(Math.max(token.length - (startChars + endChars), 3));

  return start + middle + end;
};


/**
 * Format timestamps for use in filenames
 * @param {Date} [date=new Date()] - Date to format
 * @returns {string} Formatted timestamp
 */
export const formatTimestamp = (date = new Date()) => {
  return date.toISOString().replace(/[:.]/g, '-');
};

/**
 * Create safe file names from arbitrary strings
 * @param {string} name - Name to sanitize
 * @returns {string} Sanitized filename
 */
export const sanitizeFileName = (name) => {
  return name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
};

/**
 * Check if running in specific runtime
 * @returns {string} Runtime name (node, bun, or deno)
 */
export const getRuntime = () => {
  if (typeof Bun !== 'undefined') return 'bun';
  if (typeof Deno !== 'undefined') return 'deno';
  return 'node';
};

/**
 * Get platform information
 * @returns {Object} Platform information object
 */
export const getPlatformInfo = () => {
  return {
    platform: process.platform,
    arch: process.arch,
    runtime: getRuntime(),
    nodeVersion: process.versions?.node,
    bunVersion: process.versions?.bun
  };
};

/**
 * Safely parse JSON with fallback
 * @param {string} text - JSON string to parse
 * @param {*} [defaultValue=null] - Default value if parsing fails
 * @returns {*} Parsed JSON or default value
 */
export const safeJsonParse = (text, defaultValue = null) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    // This is intentionally silent as it's a safe parse with fallback
    // Only report in verbose mode for debugging
    if (global.verboseMode) {
      reportError(error, {
        context: 'safe_json_parse',
        level: 'debug',
        textPreview: text?.substring(0, 100)
      });
    }
    return defaultValue;
  }
};

/**
 * Sleep/delay execution
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry operations with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @param {number} [options.maxAttempts=3] - Maximum number of attempts
 * @param {number} [options.delay=1000] - Initial delay between retries in ms
 * @param {number} [options.backoff=2] - Backoff multiplier
 * @returns {Promise<*>} Result of successful function execution
 * @throws {Error} Last error if all attempts fail
 */
export const retry = async (fn, options = {}) => {
  const { maxAttempts = 3, delay = 1000, backoff = 2 } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Report error to Sentry with retry context
      reportError(error, {
        context: 'retry_operation',
        attempt,
        maxAttempts,
        willRetry: attempt < maxAttempts
      });

      if (attempt === maxAttempts) throw error;

      const waitTime = delay * Math.pow(backoff, attempt - 1);
      await log(`Attempt ${attempt} failed, retrying in ${waitTime}ms...`, { level: 'warn' });
      await sleep(waitTime);
    }
  }
};

/**
 * Format bytes to human readable string
 * @param {number} bytes - Number of bytes
 * @param {number} [decimals=2] - Number of decimal places
 * @returns {string} Formatted size string
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Measure execution time of async functions
 * @param {Function} fn - Function to measure
 * @param {string} [label='Operation'] - Label for the operation
 * @returns {Promise<*>} Result of the function
 * @throws {Error} Error from the function if it fails
 */
export const measureTime = async (fn, label = 'Operation') => {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    await log(`${label} completed in ${duration}ms`, { verbose: true });
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    await log(`${label} failed after ${duration}ms`, { level: 'error' });
    reportError(error, {
      context: 'measure_time',
      operation: label,
      duration
    });
    throw error;
  }
};

/**
 * Clean up error messages for better user experience
 * @param {Error|string} error - Error object or message
 * @returns {string} Cleaned error message
 */
export const cleanErrorMessage = (error) => {
  let message = error.message || error.toString();
  
  // Remove common noise from error messages
  message = message.split('\n')[0]; // Take only first line
  message = message.replace(/^Command failed: /, ''); // Remove "Command failed: " prefix
  message = message.replace(/^Error: /, ''); // Remove redundant "Error: " prefix
  message = message.replace(/^\/bin\/sh: \d+: /, ''); // Remove shell path info
  
  return message;
};

/**
 * Format aligned console output
 * @param {string} icon - Icon to display
 * @param {string} label - Label text
 * @param {string} value - Value text
 * @param {number} [indent=0] - Indentation level
 * @returns {string} Formatted string
 */
export const formatAligned = (icon, label, value, indent = 0) => {
  const spaces = ' '.repeat(indent);
  const labelWidth = 25 - indent;
  const paddedLabel = label.padEnd(labelWidth, ' ');
  return `${spaces}${icon} ${paddedLabel} ${value || ''}`;
};

/**
 * Display formatted error messages with sections
 * @param {Object} options - Display options
 * @param {string} options.title - Error title
 * @param {string} [options.what] - What happened
 * @param {string|Array} [options.details] - Error details
 * @param {Array<string>} [options.causes] - Possible causes
 * @param {Array<string>} [options.fixes] - Possible fixes
 * @param {string} [options.workDir] - Working directory
 * @param {Function} [options.log] - Log function to use
 * @param {string} [options.level='error'] - Log level
 * @returns {Promise<void>}
 */
export const displayFormattedError = async (options) => {
  const {
    title,
    what,
    details,
    causes,
    fixes,
    workDir,
    log: logFn = log,
    level = 'error'
  } = options;

  await logFn('');
  await logFn(`❌ ${title}`, { level });
  await logFn('');

  if (what) {
    await logFn('  🔍 What happened:');
    await logFn(`     ${what}`);
    await logFn('');
  }

  if (details) {
    await logFn('  📦 Error details:');
    const detailLines = Array.isArray(details) ? details : details.split('\n');
    for (const line of detailLines) {
      if (line.trim()) await logFn(`     ${line.trim()}`);
    }
    await logFn('');
  }

  if (causes && causes.length > 0) {
    await logFn('  💡 Possible causes:');
    for (const cause of causes) {
      await logFn(`     • ${cause}`);
    }
    await logFn('');
  }

  if (fixes && fixes.length > 0) {
    await logFn('  🔧 How to fix:');
    for (let i = 0; i < fixes.length; i++) {
      await logFn(`     ${i + 1}. ${fixes[i]}`);
    }
    await logFn('');
  }

  if (workDir) {
    await logFn(`  📂 Working directory: ${workDir}`);
    await logFn('');
  }

  // Always show the log file path if it exists - using absolute path
  if (logFile) {
    const path = (await use('path'));
    const absoluteLogPath = path.resolve(logFile);
    await logFn(`  📁 Full log file: ${absoluteLogPath}`);
    await logFn('');
  }
};

/**
 * Clean up temporary directories
 * @param {Object} argv - Command line arguments
 * @param {boolean} [argv.autoCleanup] - Whether auto-cleanup is enabled
 * @returns {Promise<void>}
 */
export const cleanupTempDirectories = async (argv) => {
  if (!argv || !argv.autoCleanup) {
    return;
  }
  
  // Dynamic import for command-stream
  const { $ } = await use('command-stream');
  
  try {
    await log('\n🧹 Auto-cleanup enabled, removing temporary directories...');
    await log('   ⚠️  Executing: sudo rm -rf /tmp/* /var/tmp/*', { verbose: true });
    
    // Execute cleanup command using command-stream
    const cleanupCommand = $`sudo rm -rf /tmp/* /var/tmp/*`;
    
    let exitCode = 0;
    for await (const chunk of cleanupCommand.stream()) {
      if (chunk.type === 'stderr') {
        const error = chunk.data.toString().trim();
        if (error && !error.includes('cannot remove')) { // Ignore "cannot remove" warnings for files in use
          await log(`   [cleanup WARNING] ${error}`, { level: 'warn', verbose: true });
        }
      } else if (chunk.type === 'exit') {
        exitCode = chunk.code;
      }
    }
    
    if (exitCode === 0) {
      await log('   ✅ Temporary directories cleaned successfully');
    } else {
      await log(`   ⚠️  Cleanup completed with warnings (exit code: ${exitCode})`, { level: 'warn' });
    }
  } catch (error) {
    reportError(error, {
      context: 'cleanup_temp_directories',
      autoCleanup: argv?.autoCleanup
    });
    await log(`   ❌ Error during cleanup: ${cleanErrorMessage(error)}`, { level: 'error' });
    // Don't fail the entire process if cleanup fails
  }
};

// Export all functions as default object too
export default {
  log,
  setLogFile,
  getLogFile,
  getAbsoluteLogPath,
  maskToken,
  formatTimestamp,
  sanitizeFileName,
  getRuntime,
  getPlatformInfo,
  safeJsonParse,
  sleep,
  retry,
  formatBytes,
  measureTime,
  cleanErrorMessage,
  formatAligned,
  displayFormattedError,
  cleanupTempDirectories
};

/**
 * Get version information for logging
 * @returns {Promise<string>} Version string
 */
export const getVersionInfo = async () => {
  const path = (await use('path'));
  const $ = (await use('zx')).$;
  const { getGitVersionAsync } = await import('./git.lib.mjs');

  try {
    const packagePath = path.join(path.dirname(path.dirname(new globalThis.URL(import.meta.url).pathname)), 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf8'));
    const currentVersion = packageJson.version;

    // Use git.lib.mjs to get version with proper git error handling
    return await getGitVersionAsync($, currentVersion);
  } catch {
    // Fallback to hardcoded version if all else fails
    return '0.10.4';
  }
};

// Export reportError for other modules that may import it
export { reportError, reportWarning };