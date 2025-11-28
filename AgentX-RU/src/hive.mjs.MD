# 📚 Документация: hive.mjs

## 🎯 Назначение файла

`hive.mjs` - это **главный исполняемый файл команды `hive`**, которая организует массовую обработку GitHub Issues с использованием AI. Это система непрерывного мониторинга, которая:

- 🔍 **Мониторит GitHub Issues** в организациях, репозиториях или личных аккаунтах
- 🤖 **Автоматически назначает AI агенты** для решения найденных задач
- 👷 **Управляет очередью задач** с помощью Producer/Consumer паттерна
- 🔄 **Работает в режиме непрерывного мониторинга** (continuous mode) или однократного запуска (single run)
- 📊 **Поддерживает параллельную обработку** множества Issues одновременно

**Ключевая идея**: Hive Mind - это "рой разума", где множество AI агентов работают параллельно над разными задачами, как пчёлы в улье.

## 📋 Полный код с подробными комментариями

```javascript
#!/usr/bin/env node
// ^^^^^^^^^^^^^^^^^^^
// Shebang - указывает системе использовать Node.js для выполнения этого скрипта
// Это позволяет запускать файл напрямую: ./hive.mjs
// Вместо: node hive.mjs

// ==============================================
// РАЗДЕЛ 1: РАННЯЯ ИНИЦИАЛИЗАЦИЯ
// ==============================================
// Порядок импортов КРИТИЧЕСКИ ВАЖЕН!

// Import Sentry instrumentation first (must be before other imports)
import './instrument.mjs';
// ^^^^^^^^^^^^^^^^^^
// SENTRY ИНИЦИАЛИЗАЦИЯ - ДОЛЖНА БЫТЬ ПЕРВОЙ!
// Почему первой? Sentry должен "обернуть" все последующие импорты
// для отслеживания ошибок на самых ранних стадиях

// ==============================================
// РАЗДЕЛ 2: ОБРАБОТКА РАННИХ АРГУМЕНТОВ
// ==============================================
// Некоторые операции (--version, --help) не требуют загрузки всех модулей
// Обрабатываем их ДО загрузки тяжёлых зависимостей для ускорения

const earlyArgs = process.argv.slice(2);
// process.argv - массив аргументов командной строки:
// [0] = путь к node
// [1] = путь к скрипту (hive.mjs)
// [2+] = аргументы пользователя
// .slice(2) отбрасывает первые два элемента

// --version: Показать версию и выйти
if (earlyArgs.includes('--version')) {
  const { getVersion } = await import('./version.lib.mjs');
  try {
    const version = await getVersion();
    console.log(version);
  } catch {
    console.error('Error: Unable to determine version');
    process.exit(1);
  }
  process.exit(0);
}

// --help: Показать справку и выйти
if (earlyArgs.includes('--help') || earlyArgs.includes('-h')) {
  try {
    // Load minimal modules needed for help
    // Загружаем МИНИМУМ модулей только для отображения справки
    const { use } = eval(await (await fetch('https://unpkg.com/use-m/use.js')).text());
    globalThis.use = use;
    const yargsModule = await use('yargs@17.7.2');
    const yargs = yargsModule.default || yargsModule;
    const { hideBin } = await use('yargs@17.7.2/helpers');
    const rawArgs = hideBin(process.argv);

    // Reuse createYargsConfig from shared module to avoid duplication
    const { createYargsConfig } = await import('./hive.config.lib.mjs');
    const helpYargs = createYargsConfig(yargs(rawArgs)).version(false);

    // Show help and exit
    helpYargs.showHelp();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error: Failed to load help information');
    console.error(`   ${error.message}`);
    console.error('   This might be due to network issues or missing dependencies.');
    console.error('   Please check your internet connection and try again.');
    process.exit(1);
  }
}

export { createYargsConfig } from './hive.config.lib.mjs';

// ==============================================
// РАЗДЕЛ 3: ПРОВЕРКА РЕЖИМА ВЫПОЛНЕНИЯ
// ==============================================
// Only execute main logic if this module is being run directly (not imported)
// Выполнять основную логику ТОЛЬКО если модуль запущен напрямую, а не импортирован

import { fileURLToPath } from 'url';
const isDirectExecution = process.argv[1] === fileURLToPath(import.meta.url) ||
                          (process.argv[1] && (process.argv[1].includes('/hive') || process.argv[1].endsWith('hive')));
// ^^^^^^^^^^^^^^^^^^
// Определяем, запущен ли файл напрямую или импортирован:
// 1. process.argv[1] === fileURLToPath(import.meta.url) - точное совпадение пути
// 2. Проверяем имя файла на случай симлинков (npm global install создаёт симлинки)

if (isDirectExecution) {
// ^^^^^^^^^^^^^^^^^^
// Весь код ниже выполняется ТОЛЬКО при прямом запуске
// Это позволяет другим модулям импортировать экспорты без запуска основной логики

console.log('🐝 Hive Mind - AI-powered issue solver');
console.log('   Initializing...');

try {
console.log('   Loading dependencies (this may take a moment)...');

// ==============================================
// РАЗДЕЛ 4: HELPER ФУНКЦИЯ ДЛЯ TIMEOUT
// ==============================================
const withTimeout = (promise, timeoutMs, operation) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Operation '${operation}' timed out after ${timeoutMs}ms. This might be due to slow network or npm configuration issues.`)), timeoutMs)
    )
  ]);
};
// ^^^^^^^^^^^^^^^^^^
// Функция-обёртка для добавления таймаута к любому Promise
// Используется для предотвращения зависания при загрузке зависимостей
// Promise.race - возвращает результат первого завершившегося Promise
// Если операция не завершится за timeoutMs, будет выброшена ошибка

// ==============================================
// РАЗДЕЛ 5: ЗАГРУЗКА USE-M
// ==============================================
// Use use-m to dynamically import modules for cross-runtime compatibility
if (typeof use === 'undefined') {
  try {
    // Wrap fetch in timeout to prevent hanging
    const useMCode = await withTimeout(
      fetch('https://unpkg.com/use-m/use.js').then(r => r.text()),
      10000,
      'fetching use-m library'
    );
    globalThis.use = (await eval(useMCode)).use;
  } catch (error) {
    console.error('❌ Fatal error: Failed to load dependencies');
    console.error(`   ${error.message}`);
    console.error('   This might be due to network issues or missing dependencies.');
    console.error('   Please check your internet connection and try again.');
    process.exit(1);
  }
}
// ^^^^^^^^^^^^^^^^^^
// USE-M - это библиотека для динамической загрузки npm модулей БЕЗ package.json
// Работает во всех JavaScript runtime (Node.js, Deno, Bun)
// Загружает модули с CDN (unpkg.com) и кэширует их локально

// ==============================================
// РАЗДЕЛ 6: ЗАГРУЗКА ОСНОВНЫХ ЗАВИСИМОСТЕЙ
// ==============================================
// Use command-stream for consistent $ behavior across runtimes
const { $ } = await withTimeout(
  use('command-stream'),
  30000, // 30 second timeout
  'loading command-stream'
);
// ^^^^^^^^^^^^^^^^^^
// COMMAND-STREAM - библиотека для выполнения shell команд
// Предоставляет удобный $ интерфейс (как в Bash):
// await $`git status` - выполнить команду и получить результат

const yargsModule = await withTimeout(
  use('yargs@17.7.2'),
  30000,
  'loading yargs'
);
const yargs = yargsModule.default || yargsModule;
// ^^^^^^^^^^^^^^^^^^
// YARGS - библиотека для парсинга аргументов командной строки
// Версия 17.7.2 фиксирована для стабильности

const { hideBin } = await withTimeout(
  use('yargs@17.7.2/helpers'),
  30000,
  'loading yargs helpers'
);
// ^^^^^^^^^^^^^^^^^^
// hideBin - helper функция, которая удаляет первые 2 элемента из process.argv
// (путь к node и путь к скрипту), оставляя только пользовательские аргументы

const path = (await withTimeout(use('path'), 30000, 'loading path')).default;
const fs = (await withTimeout(use('fs'), 30000, 'loading fs')).promises;
// ^^^^^^^^^^^^^^^^^^
// path - модуль для работы с путями файловой системы
// fs.promises - Promise-based API для файловых операций

// ==============================================
// РАЗДЕЛ 7: ИМПОРТ ВНУТРЕННИХ БИБЛИОТЕК
// ==============================================
const lib = await import('./lib.mjs');
const { log, setLogFile, getAbsoluteLogPath, formatTimestamp, cleanErrorMessage, cleanupTempDirectories } = lib;
// ^^^^^^^^^^^^^^^^^^
// lib.mjs - общая библиотека утилит:
// - log: универсальная функция логирования (консоль + файл)
// - setLogFile: установить файл для логов
// - getAbsoluteLogPath: получить абсолютный путь к лог-файлу
// - formatTimestamp: форматировать время для имён файлов
// - cleanErrorMessage: очистить сообщения об ошибках
// - cleanupTempDirectories: очистить временные директории

const yargsConfigLib = await import('./hive.config.lib.mjs');
const { createYargsConfig } = yargsConfigLib;
// ^^^^^^^^^^^^^^^^^^
// hive.config.lib.mjs - конфигурация Yargs для команды hive
// createYargsConfig - создаёт объект Yargs с параметрами команды hive

const claudeLib = await import('./claude.lib.mjs');
const { validateClaudeConnection } = claudeLib;
// ^^^^^^^^^^^^^^^^^^
// claude.lib.mjs - интеграция с Claude CLI
// validateClaudeConnection - проверить соединение с Claude API

const githubLib = await import('./github.lib.mjs');
const { checkGitHubPermissions, fetchAllIssuesWithPagination, fetchProjectIssues, isRateLimitError, batchCheckPullRequestsForIssues, parseGitHubUrl, batchCheckArchivedRepositories } = githubLib;
// ^^^^^^^^^^^^^^^^^^
// github.lib.mjs - интеграция с GitHub API:
// - checkGitHubPermissions: проверить права доступа к GitHub
// - fetchAllIssuesWithPagination: получить все Issues с пагинацией
// - fetchProjectIssues: получить Issues из GitHub Project
// - isRateLimitError: проверить, является ли ошибка rate limit
// - batchCheckPullRequestsForIssues: batch-проверка PR для Issues
// - parseGitHubUrl: распарсить GitHub URL
// - batchCheckArchivedRepositories: проверить архивированные репозитории

// Import YouTrack-related functions
const youTrackLib = await import('./youtrack/youtrack.lib.mjs');
const {
  validateYouTrackConfig,
  testYouTrackConnection,
  createYouTrackConfigFromEnv
} = youTrackLib;
// ^^^^^^^^^^^^^^^^^^
// YouTrack интеграция - система управления задачами JetBrains
// Позволяет синхронизировать задачи из YouTrack в GitHub Issues

const youTrackSync = await import('./youtrack/youtrack-sync.mjs');
const { syncYouTrackToGitHub, formatIssuesForHive } = youTrackSync;

const memCheck = await import('./memory-check.mjs');
const { checkSystem } = memCheck;
// ^^^^^^^^^^^^^^^^^^
// memory-check.mjs - проверка системных ресурсов
// checkSystem: проверить диск и RAM перед запуском

const exitHandler = await import('./exit-handler.lib.mjs');
const { initializeExitHandler, installGlobalExitHandlers, safeExit } = exitHandler;
// ^^^^^^^^^^^^^^^^^^
// exit-handler.lib.mjs - корректное завершение процесса
// - initializeExitHandler: инициализировать обработчики выхода
// - installGlobalExitHandlers: установить глобальные обработчики
// - safeExit: безопасно завершить процесс с очисткой

const sentryLib = await import('./sentry.lib.mjs');
const { initializeSentry, withSentry, addBreadcrumb, reportError } = sentryLib;
// ^^^^^^^^^^^^^^^^^^
// sentry.lib.mjs - интеграция с Sentry для отслеживания ошибок
// - initializeSentry: инициализировать Sentry
// - withSentry: обернуть функцию для отслеживания ошибок
// - addBreadcrumb: добавить breadcrumb для отладки
// - reportError: отправить ошибку в Sentry

const graphqlLib = await import('./github.graphql.lib.mjs');
const { tryFetchIssuesWithGraphQL } = graphqlLib;
// ^^^^^^^^^^^^^^^^^^
// github.graphql.lib.mjs - GitHub GraphQL API
// tryFetchIssuesWithGraphQL - получить Issues через GraphQL (быстрее, чем REST)

const commandName = process.argv[1] ? process.argv[1].split('/').pop() : '';
const isLocalScript = commandName.endsWith('.mjs');
const solveCommand = isLocalScript ? './solve.mjs' : 'solve';
// ^^^^^^^^^^^^^^^^^^
// Определяем команду solve:
// - Если запущен локальный скрипт (*.mjs) - используем './solve.mjs'
// - Если установлен глобально - используем 'solve'

// ==============================================
// РАЗДЕЛ 8: ФУНКЦИЯ FALLBACK ДЛЯ ПОЛУЧЕНИЯ ISSUES
// ==============================================

/**
 * Fallback function to fetch issues from organization/user repositories
 * when search API hits rate limits
 * @param {string} owner - Organization or user name
 * @param {string} scope - 'organization' or 'user'
 * @param {string} monitorTag - Label to filter by (optional)
 * @param {boolean} allIssues - Whether to fetch all issues or only labeled ones
 * @returns {Promise<Array>} Array of issues
 */
async function fetchIssuesFromRepositories(owner, scope, monitorTag, fetchAllIssues = false) {
  const { execSync } = await import('child_process');
  // ^^^^^^^^^^^^^^^^^^
  // execSync - синхронное выполнение команд
  // Используется для gh cli команд

  try {
    await log(`   🔄 Using repository-by-repository fallback for ${scope}: ${owner}`);

    // Strategy 1: Try GraphQL approach first (faster but has limitations)
    if (fetchAllIssues) {
      const graphqlResult = await tryFetchIssuesWithGraphQL(owner, scope, log, cleanErrorMessage);
      if (graphqlResult.success) {
        await log(`   ✅ GraphQL approach successful: ${graphqlResult.issues.length} issues from ${graphqlResult.repoCount} repositories`);
        return graphqlResult.issues;
      }
    }

    // Strategy 2: Fallback to gh api --paginate approach (comprehensive but slower)
    await log('   📋 Using gh api --paginate approach for comprehensive coverage...', { verbose: true });

    let repoListCmd;
    if (scope === 'organization') {
      repoListCmd = `gh api orgs/${owner}/repos --paginate --jq '.[] | {name: .name, owner: .owner.login, isArchived: .archived}'`;
    } else {
      repoListCmd = `gh api users/${owner}/repos --paginate --jq '.[] | {name: .name, owner: .owner.login, isArchived: .archived}'`;
    }
    // ^^^^^^^^^^^^^^^^^^
    // gh api - прямой доступ к GitHub API через GitHub CLI
    // --paginate - автоматическая пагинация (неограниченная)
    // --jq - форматирование вывода через jq (JSON процессор)

    await log(`   🔎 Command: ${repoListCmd}`, { verbose: true });

    // Add delay for rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
    // ^^^^^^^^^^^^^^^^^^
    // 2-секундная задержка для предотвращения rate limiting

    const repoOutput = execSync(repoListCmd, { encoding: 'utf8' });
    const repoLines = repoOutput.trim().split('\n').filter(line => line.trim());
    const allRepositories = repoLines.map(line => JSON.parse(line));

    await log(`   📊 Found ${allRepositories.length} repositories`);

    // Filter repositories to only include those owned by the target user/org
    const ownedRepositories = allRepositories.filter(repo => {
      const repoOwner = repo.owner?.login || repo.owner;
      return repoOwner === owner;
    });

    const unownedCount = allRepositories.length - ownedRepositories.length;
    if (unownedCount > 0) {
      await log(`   ⏭️  Skipping ${unownedCount} repository(ies) not owned by ${owner}`);
    }

    // Filter out archived repositories
    const repositories = ownedRepositories.filter(repo => !repo.isArchived);
    const archivedCount = ownedRepositories.length - repositories.length;

    if (archivedCount > 0) {
      await log(`   ⏭️  Skipping ${archivedCount} archived repository(ies)`);
    }

    await log(`   ✅ Processing ${repositories.length} non-archived repositories owned by ${owner}`);

    let collectedIssues = [];
    let processedRepos = 0;

    // Process repositories in batches
    for (const repo of repositories) {
      try {
        const repoName = repo.name;
        const ownerName = repo.owner?.login || owner;

        await log(`   🔍 Fetching issues from ${ownerName}/${repoName}...`, { verbose: true });

        let issueCmd;
        if (fetchAllIssues) {
          issueCmd = `gh issue list --repo ${ownerName}/${repoName} --state open --json url,title,number,createdAt`;
        } else {
          issueCmd = `gh issue list --repo ${ownerName}/${repoName} --state open --label "${monitorTag}" --json url,title,number,createdAt`;
        }

        // Add delay between repository requests
        await new Promise(resolve => setTimeout(resolve, 1000));

        const repoIssues = await fetchAllIssuesWithPagination(issueCmd);

        // Add repository information to each issue
        const issuesWithRepo = repoIssues.map(issue => ({
          ...issue,
          repository: {
            name: repoName,
            owner: { login: ownerName }
          }
        }));

        collectedIssues.push(...issuesWithRepo);
        processedRepos++;

        if (issuesWithRepo.length > 0) {
          await log(`   ✅ Found ${issuesWithRepo.length} issues in ${ownerName}/${repoName}`, { verbose: true });
        }

      } catch (repoError) {
        reportError(repoError, {
          context: 'fetchIssuesFromRepositories',
          repo: repo.name,
          operation: 'fetch_repo_issues'
        });
        await log(`   ⚠️  Failed to fetch issues from ${repo.name}: ${cleanErrorMessage(repoError)}`, { verbose: true });
        // Continue with other repositories
      }
    }

    await log(`   ✅ Repository fallback complete: ${collectedIssues.length} issues from ${processedRepos}/${repositories.length} repositories`);
    return collectedIssues;

  } catch (error) {
    reportError(error, {
      context: 'fetchIssuesFromRepositories',
      owner,
      scope,
      operation: 'repository_fallback'
    });
    await log(`   ❌ Repository fallback failed: ${cleanErrorMessage(error)}`, { level: 'error' });
    return [];
  }
}

// ==============================================
// РАЗДЕЛ 9: ПАРСИНГ АРГУМЕНТОВ КОМАНДНОЙ СТРОКИ
// ==============================================

const rawArgs = hideBin(process.argv);
let argv;

// Temporarily suppress stderr to prevent yargs from printing error messages
const originalStderrWrite = process.stderr.write;
let stderrBuffer = '';
process.stderr.write = function(chunk, encoding, callback) {
  // Capture stderr output instead of writing it
  stderrBuffer += chunk.toString();
  if (typeof encoding === 'function') {
    encoding();
  } else if (callback) {
    callback();
  }
  return true;
};
// ^^^^^^^^^^^^^^^^^^
// Временно перехватываем stderr для контроля ошибок yargs
// Это позволяет нам показывать свои сообщения об ошибках

try {
  argv = await createYargsConfig(yargs()).parse(rawArgs);
  // Restore stderr if parsing succeeded
  process.stderr.write = originalStderrWrite;
} catch (error) {
  // Restore stderr before handling the error
  process.stderr.write = originalStderrWrite;

  // If .strict() mode catches an unknown argument, fail fast
  if (error.message && error.message.includes('Unknown argument')) {
    console.error('Error:', error.message);
    process.exit(1);
  }

  // Yargs sometimes throws "Not enough arguments" errors
  // The error.argv object still contains the parsed arguments
  if (error.argv) {
    argv = error.argv;
  } else {
    if (stderrBuffer) {
      process.stderr.write(stderrBuffer);
    }
    throw error;
  }
}

let githubUrl = argv['github-url'];

// Set global verbose mode
global.verboseMode = argv.verbose;

// ==============================================
// РАЗДЕЛ 10: ВАЛИДАЦИЯ GITHUB URL
// ==============================================

if (githubUrl) {
  const parsedUrl = parseGitHubUrl(githubUrl);

  if (!parsedUrl.valid) {
    console.error('Error: Invalid GitHub URL format');
    if (parsedUrl.error) {
      console.error(`  ${parsedUrl.error}`);
    }
    console.error('Expected: https://github.com/owner or https://github.com/owner/repo');
    // ... показать примеры форматов ...
    await safeExit(1, 'Error occurred');
  }

  // Check if it's a valid type for hive (user or repo)
  if (parsedUrl.type !== 'user' && parsedUrl.type !== 'repo') {
    console.error('Error: Invalid GitHub URL for monitoring');
    console.error(`  URL type '${parsedUrl.type}' is not supported`);
    await safeExit(1, 'Error occurred');
  }

  // Use the normalized URL
  githubUrl = parsedUrl.normalized;
}

let urlMatch = null;
const needsUrlValidation = githubUrl;

if (needsUrlValidation) {
  urlMatch = githubUrl.match(/^https:\/\/github\.com\/([^/]+)(\/([^/]+))?$/);
  if (!urlMatch) {
    console.error('Error: Invalid GitHub URL format');
    // ... показать примеры ...
    await safeExit(1, 'Error occurred');
  }
}

// Остальной код продолжается...
// (Полный файл содержит 1484 строки)

```

## 🔍 Детальный разбор ключевых компонентов

### 1. Producer/Consumer Pattern (Очередь задач)

```javascript
class IssueQueue {
  constructor() {
    this.queue = [];           // Очередь необработанных задач
    this.processing = new Set(); // Обрабатываемые сейчас задачи
    this.completed = new Set();  // Завершённые задачи
    this.failed = new Set();     // Проваленные задачи
    this.workers = [];          // Массив воркеров
    this.isRunning = true;      // Флаг работы системы
  }
}
```

**Почему Set, а не Array для processing/completed/failed?**
- Set обеспечивает O(1) проверку наличия элемента
- Set автоматически предотвращает дубликаты
- Set.has() быстрее чем Array.includes() для больших коллекций

### 2. Worker Function (Параллельная обработка)

Каждый воркер работает независимо в бесконечном цикле:

1. Берёт Issue из очереди (`dequeue()`)
2. Запускает `solve` команду через `spawn`
3. Стримит вывод в реальном времени
4. Помечает Issue как completed/failed
5. Возвращается к шагу 1

**Почему spawn, а не exec?**
- spawn предоставляет real-time streaming output
- exec буферизует весь вывод в памяти
- spawn лучше для long-running процессов

### 3. Rate Limiting и Fallback Strategies

GitHub API имеет строгие лимиты:
- Search API: 30 запросов/минуту
- REST API: 5000 запросов/час

**Стратегия обработки:**

1. **Первая попытка**: GitHub Search API
2. **При Rate Limit**: GraphQL API (быстрее, но есть ограничения)
3. **Финальный fallback**: Repository-by-repository с задержками

### 4. YouTrack Integration

YouTrack - это система управления задачами от JetBrains. Hive может:

1. Синхронизировать задачи из YouTrack в GitHub Issues
2. Фильтровать по стадиям (stages)
3. Автоматически обрабатывать синхронизированные Issues

### 5. System Resource Checks

Перед запуском проверяется:

- **Disk Space**: Минимум 500MB (по умолчанию)
- **Memory**: Минимум 256MB
- **GitHub Authentication**: Валидные credentials
- **Claude CLI**: Доступность и подключение

## 🚀 Использование

### Базовый запуск:

```bash
# Мониторить организацию
hive https://github.com/my-org --monitor-tag "ai-solve"

# Мониторить репозиторий
hive https://github.com/owner/repo --all-issues

# Однократный запуск (не циклический)
hive https://github.com/owner/repo --once

# Параллельная обработка 5 Issues одновременно
hive https://github.com/owner/repo --concurrency 5
```

### Продвинутые опции:

```bash
# GitHub Project mode
hive https://github.com/owner/repo \
  --project-mode \
  --project-number 1 \
  --project-owner "my-org" \
  --project-status "Todo"

# YouTrack integration
YOUTRACK_URL=https://company.youtrack.cloud \
YOUTRACK_API_KEY=perm:xxx \
YOUTRACK_PROJECT_CODE=PROJ \
YOUTRACK_STAGE="Ready for AI" \
hive https://github.com/owner/repo --youtrack-mode

# С авто-форком
hive https://github.com/owner/repo --auto-fork
```

## 📊 Примеры вывода

### Успешный запуск:

```
🐝 Hive Mind - AI-powered issue solver
   Initializing...
   Loading dependencies (this may take a moment)...

📁 Log file: /path/to/hive-2025-11-28-123456.log
   (All output will be logged here)

🎯 Monitoring Configuration:
   📍 Target: Organization - my-org
   🏷️  Tag: "ai-solve"
   🔄 Concurrency: 3 parallel workers
   🤖 Model: sonnet
   ♾️  Mode: Continuous monitoring

🚀 Starting Hive Mind monitoring system...

👷 Starting 3 workers...
🔧 Worker 1 started
🔧 Worker 2 started
🔧 Worker 3 started

🔄 Monitoring iteration 1 at 2025-11-28T12:34:56.789Z

🔍 Fetching issues with label "ai-solve"...
   📋 Found 5 issue(s) with label "ai-solve"

   ➕ Added to queue: https://github.com/my-org/repo1/issues/123
   ➕ Added to queue: https://github.com/my-org/repo1/issues/124
   📥 Added 2 new issue(s) to queue

📊 Current Status:
   📋 Queued: 2
   ⚙️  Processing: 0
   ✅ Completed: 0
   ❌ Failed: 0

👷 Worker 1 processing: https://github.com/my-org/repo1/issues/123
   🚀 Executing solve for https://github.com/my-org/repo1/issues/123...
```

### Обработка ошибок:

```
⚠️  Search failed: API rate limit exceeded
   🔍 Search limit detected - attempting repository fallback...
   🔄 Using repository-by-repository fallback for organization: my-org
   📋 Using gh api --paginate approach...
   📊 Found 50 repositories
   ✅ Processing 45 non-archived repositories
```

## 🛠️ Технические детали

### Используемые технологии:

- **Node.js**: JavaScript runtime
- **use-m**: Динамическая загрузка модулей без package.json
- **command-stream**: Выполнение shell команд
- **yargs**: Парсинг аргументов CLI
- **GitHub CLI (gh)**: Интеграция с GitHub
- **Claude CLI**: Интеграция с Claude AI
- **Sentry**: Мониторинг ошибок

### Архитектурные паттерны:

1. **Producer/Consumer** - для обработки очереди Issues
2. **Worker Pool** - для параллельной обработки
3. **Graceful Shutdown** - корректное завершение с cleanup
4. **Error Recovery** - обработка ошибок с продолжением работы
5. **Rate Limiting** - предотвращение превышения API лимитов

### Особенности реализации:

- **Early Exit Optimization**: --version и --help обрабатываются до загрузки всех зависимостей
- **Timeout Protection**: Все асинхронные операции защищены таймаутами
- **Retry Logic**: Автоматические повторы при временных ошибках
- **Resource Cleanup**: Автоматическая очистка временных директорий

## 🎯 Заключение

`hive.mjs` - это мощная система оркестрации AI агентов, которая:

- ✅ Автоматизирует обработку GitHub Issues в масштабе
- ✅ Эффективно управляет параллельными процессами
- ✅ Обрабатывает API ограничения с помощью fallback стратегий
- ✅ Обеспечивает надёжность через error handling и retry logic
- ✅ Интегрируется с различными системами (GitHub, YouTrack, Sentry)

Это ядро системы Hive Mind, которое превращает GitHub Issues в автоматически обрабатываемые задачи для AI агентов.
