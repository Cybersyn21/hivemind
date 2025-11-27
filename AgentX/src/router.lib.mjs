#!/usr/bin/env node

// ============================================================================
// УМНАЯ МАРШРУТИЗАЦИЯ ЗАДАЧ ПО СЛОЖНОСТИ
// ============================================================================
// Этот модуль анализирует GitHub Issue и автоматически выбирает оптимальную
// модель AI для решения задачи в зависимости от её сложности.
//
// Зачем это нужно:
// - SIMPLE задачи (опечатки, docs) → дешёвая модель (Gemini Flash, Claude Haiku)
// - STANDARD задачи (рефакторинг) → средняя модель (Gemini Pro, Claude Sonnet)
// - COMPLEX задачи (архитектура) → мощная модель (Claude Opus)
//
// Экономия: Не тратим $15 на Opus для исправления опечатки в README.
// ============================================================================

// ----------------------------------------------------------------------------
// ИМПОРТЫ И ИНИЦИАЛИЗАЦИЯ
// ----------------------------------------------------------------------------

// Проверяем наличие globalThis.use (загружается в solve.mjs)
if (typeof globalThis.use === 'undefined') {
  globalThis.use = (await eval(await (await fetch('https://unpkg.com/use-m/use.js')).text())).use;
}

// Импорт Google Generative AI для AI-классификации (если доступен)
let GoogleGenerativeAI = null;
try {
  const geminiModule = await import("@google/generative-ai");
  GoogleGenerativeAI = geminiModule.GoogleGenerativeAI;
} catch (e) {
  // Gemini SDK не установлен — будем использовать эвристику
  console.debug('Gemini SDK not available for router, using heuristic fallback');
}

// Импорт логирования
import { log } from './lib.mjs';
import { reportError } from './sentry.lib.mjs';

// ----------------------------------------------------------------------------
// ЭВРИСТИЧЕСКАЯ КЛАССИФИКАЦИЯ (FALLBACK БЕЗ AI)
// ----------------------------------------------------------------------------

/**
 * КЛАССИФИКАЦИЯ ПО КЛЮЧЕВЫМ СЛОВАМ
 * ==================================
 * Простая эвристика на основе регулярных выражений.
 * Используется как fallback если Gemini API недоступен.
 *
 * @param {string} description - Описание задачи (GitHub Issue)
 * @returns {Object} { complexity: 'SIMPLE'|'STANDARD'|'COMPLEX', reason: string }
 */
function heuristicClassifier(description) {
  const lower = description.toLowerCase();

  // ----------------------------------------------------------------
  // ПРОСТЫЕ ЗАДАЧИ (SIMPLE)
  // ----------------------------------------------------------------
  // Критерии:
  // - Исправление опечаток, грамматики
  // - Обновление документации
  // - Форматирование кода
  // - Простые CSS изменения
  const simplePatterns = [
    /typo/i,              // опечатка
    /spelling/i,          // орфография
    /grammar/i,           // грамматика
    /\breadme\b/i,        // README файл
    /\bdocs?\b/i,         // документация
    /documentation/i,
    /comment/i,           // комментарии
    /format/i,            // форматирование
    /whitespace/i,        // пробелы
    /indent/i,            // отступы
    /style/i,             // стиль (CSS)
    /broken link/i,       // сломанная ссылка
    /dead link/i,
    /missing comma/i,     // пропущенная запятая
    /semicolon/i,         // точка с запятой
  ];

  for (const pattern of simplePatterns) {
    if (pattern.test(lower)) {
      return {
        complexity: 'SIMPLE',
        reason: 'Documentation/formatting task detected'
      };
    }
  }

  // ----------------------------------------------------------------
  // СЛОЖНЫЕ ЗАДАЧИ (COMPLEX)
  // ----------------------------------------------------------------
  // Критерии:
  // - Критические баги (crash, segfault)
  // - Проблемы безопасности (CVE, XSS, SQL injection)
  // - Утечки памяти
  // - Проблемы производительности
  // - Архитектурные изменения
  const complexPatterns = [
    /\bcrash/i,           // падение приложения
    /\bsegfault/i,        // segmentation fault
    /\bsecurity\b/i,      // безопасность
    /\bcve-\d+/i,         // CVE номер
    /\bxss\b/i,           // Cross-Site Scripting
    /sql injection/i,     // SQL injection
    /\bmemory leak/i,     // утечка памяти
    /\bperformance\b/i,   // производительность
    /\barchitecture/i,    // архитектура
    /\brefactor.*architecture/i,
    /race condition/i,    // race condition
    /deadlock/i,          // deadlock
    /\bvulnerability/i,   // уязвимость
    /\bexploit/i,         // эксплойт
    /denial.of.service/i, // DoS
    /data loss/i,         // потеря данных
    /corruption/i,        // повреждение данных
  ];

  for (const pattern of complexPatterns) {
    if (pattern.test(lower)) {
      return {
        complexity: 'COMPLEX',
        reason: 'Critical/architectural task detected'
      };
    }
  }

  // ----------------------------------------------------------------
  // СТАНДАРТНЫЕ ЗАДАЧИ (STANDARD) — по умолчанию
  // ----------------------------------------------------------------
  // Всё что не попало в SIMPLE или COMPLEX:
  // - Обычные баги
  // - Новые фичи
  // - Рефакторинг
  // - Тесты
  return {
    complexity: 'STANDARD',
    reason: 'Regular development task'
  };
}

// ----------------------------------------------------------------------------
// AI-КЛАССИФИКАЦИЯ ЧЕРЕЗ GEMINI
// ----------------------------------------------------------------------------

/**
 * КЛАССИФИКАЦИЯ ЧЕРЕЗ GEMINI API
 * ================================
 * Использует Gemini Flash для анализа задачи и определения сложности.
 * Более точная классификация чем эвристика, но требует API ключ.
 *
 * @param {string} taskDescription - Полное описание задачи
 * @returns {Promise<Object>} { complexity, reason }
 */
async function classifyWithGemini(taskDescription) {
  if (!GoogleGenerativeAI) {
    throw new Error('Gemini SDK not available');
  }

  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY not set');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Промпт для классификации
  const prompt = `
Проанализируй эту задачу и определи её сложность для AI разработчика.

КЛАССИФИКАЦИИ:
- SIMPLE: Опечатки, документация, простые CSS правки, форматирование, одиночные файлы
- STANDARD: Рефакторинг, новые функции, исправление багов, изменения в нескольких файлах
- COMPLEX: Архитектурные изменения, проблемы безопасности, оптимизация производительности,
           неизвестные баги, критические падения

Верни ТОЛЬКО JSON без markdown разметки:
{ "complexity": "SIMPLE" | "STANDARD" | "COMPLEX", "reason": "краткое объяснение" }

ЗАДАЧА:
${taskDescription.slice(0, 2000)}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text()
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(text);
  } catch (e) {
    // Ошибка парсинга JSON или API
    throw new Error(`Gemini classification failed: ${e.message}`);
  }
}

// ----------------------------------------------------------------------------
// ГЛАВНАЯ ФУНКЦИЯ МАРШРУТИЗАЦИИ
// ----------------------------------------------------------------------------

/**
 * ОПРЕДЕЛЕНИЕ СЛОЖНОСТИ ЗАДАЧИ
 * ==============================
 * Анализирует описание задачи и возвращает её сложность.
 *
 * Логика работы:
 * 1. Если доступен Gemini API → используем AI-классификацию
 * 2. Если Gemini недоступен → используем эвристику (keywords)
 * 3. В случае ошибки → fallback на эвристику
 *
 * @param {string} taskDescription - Описание задачи (обычно GitHub Issue body)
 * @returns {Promise<Object>} { complexity: 'SIMPLE'|'STANDARD'|'COMPLEX', reason: string }
 */
export async function routeTaskComplexity(taskDescription) {
  // Проверяем доступность Gemini API
  if (GoogleGenerativeAI && process.env.GEMINI_API_KEY) {
    try {
      await log('🤖 Router: Используем Gemini для классификации сложности...', { verbose: true });
      const result = await classifyWithGemini(taskDescription);
      await log(`🤖 Router: ${result.complexity} (${result.reason})`, { verbose: true });
      return result;
    } catch (error) {
      // Gemini не сработал — fallback на эвристику
      await log('⚠️  Router: Gemini недоступен, используем эвристику', { level: 'warn', verbose: true });
      reportError(error, {
        context: 'router_gemini_classification',
        fallbackUsed: true
      });
    }
  }

  // Используем эвристическую классификацию
  await log('🤖 Router: Используем эвристическую классификацию', { verbose: true });
  const result = heuristicClassifier(taskDescription);
  await log(`🤖 Router: ${result.complexity} (${result.reason})`, { verbose: true });
  return result;
}

// ----------------------------------------------------------------------------
// ВЫБОР МОДЕЛИ ПО СЛОЖНОСТИ
// ----------------------------------------------------------------------------

/**
 * ВЫБОР ОПТИМАЛЬНОЙ МОДЕЛИ ПО СЛОЖНОСТИ ЗАДАЧИ
 * ==============================================
 * На основе классификации сложности выбирает подходящую модель AI.
 *
 * Матрица выбора:
 *
 * Gemini:
 *   SIMPLE   → gemini-1.5-flash (дёшево и быстро)
 *   STANDARD → gemini-1.5-pro (хороший баланс)
 *   COMPLEX  → gemini-1.5-pro (2M контекст для больших изменений)
 *
 * Claude:
 *   SIMPLE   → haiku (быстро)
 *   STANDARD → sonnet (оптимально)
 *   COMPLEX  → opus (максимальная мощность)
 *
 * @param {string} complexity - Уровень сложности ('SIMPLE', 'STANDARD', 'COMPLEX')
 * @param {string} [preferredTool='gemini'] - Предпочитаемый AI провайдер
 * @returns {string} Название модели для использования
 */
export function selectModelByComplexity(complexity, preferredTool = 'gemini') {
  // Матрица соответствия: tool → complexity → model
  const modelMap = {
    gemini: {
      SIMPLE: 'gemini-1.5-flash',
      STANDARD: 'gemini-1.5-pro',
      COMPLEX: 'gemini-1.5-pro'
    },
    claude: {
      SIMPLE: 'haiku',
      STANDARD: 'sonnet',
      COMPLEX: 'opus'
    },
    opencode: {
      SIMPLE: 'grok-code-fast-1',
      STANDARD: 'gpt4o',
      COMPLEX: 'gpt4o'
    },
    codex: {
      SIMPLE: 'gpt5',
      STANDARD: 'gpt5-codex',
      COMPLEX: 'o3'
    }
  };

  // Выбираем модель из матрицы
  const selectedModel = modelMap[preferredTool]?.[complexity];

  // Если не нашли — fallback на STANDARD для gemini
  if (!selectedModel) {
    await log(`⚠️  Неизвестная комбинация tool=${preferredTool}, complexity=${complexity}`, {
      level: 'warn'
    });
    return modelMap.gemini.STANDARD;
  }

  return selectedModel;
}

// ----------------------------------------------------------------------------
// ЭКСПОРТ МОДУЛЯ
// ----------------------------------------------------------------------------

export default {
  routeTaskComplexity,
  selectModelByComplexity,
  heuristicClassifier
};
