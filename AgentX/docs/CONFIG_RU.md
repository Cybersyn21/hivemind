# Руководство по конфигурации

Приложение Hive Mind теперь поддерживает обширную конфигурацию через переменные окружения с использованием пакета `getenv`. Это позволяет настраивать различные аспекты приложения без изменения исходного кода.

## Обзор конфигурации

Вся конфигурация управляется через модуль `src/config.lib.mjs`, который использует `getenv` из use-m для обработки переменных окружения. Конфигурация использует имена свойств в camelCase для единообразия.

## Категории конфигурации

### 1. Конфигурация таймаутов (timeouts)

- `HIVE_MIND_CLAUDE_TIMEOUT_SECONDS`: Таймаут Claude CLI в секундах (по умолчанию: 60)
- `HIVE_MIND_GITHUB_API_DELAY_MS`: Задержка между вызовами GitHub API (по умолчанию: 5000)
- `HIVE_MIND_GITHUB_REPO_DELAY_MS`: Задержка между операциями с репозиториями (по умолчанию: 2000)
- `HIVE_MIND_RETRY_BASE_DELAY_MS`: Базовая задержка для операций повтора (по умолчанию: 5000)
- `HIVE_MIND_RETRY_BACKOFF_DELAY_MS`: Задержка отката для повторов (по умолчанию: 1000)

Доступны как: `timeouts.claudeCli`, `timeouts.githubApiDelay` и т.д.

### 2. Настройки автоматического продолжения (autoContinue)

- `HIVE_MIND_AUTO_CONTINUE_AGE_HOURS`: Минимальный возраст PR перед авто-продолжением (по умолчанию: 24)

Доступно как: `autoContinue.ageThresholdHours`

### 3. Лимиты GitHub API (githubLimits)

- `HIVE_MIND_GITHUB_COMMENT_MAX_SIZE`: Максимальный размер комментариев GitHub (по умолчанию: 65536)
- `HIVE_MIND_GITHUB_FILE_MAX_SIZE`: Максимальный размер файла для операций GitHub (по умолчанию: 26214400 / 25MB)
- `HIVE_MIND_GITHUB_ISSUE_BODY_MAX_SIZE`: Максимальный размер тела issue (по умолчанию: 60000)
- `HIVE_MIND_GITHUB_ATTACHMENT_MAX_SIZE`: Максимальный размер вложения (по умолчанию: 10485760 / 10MB)
- `HIVE_MIND_GITHUB_BUFFER_MAX_SIZE`: Максимальный размер буфера для операций GitHub (по умолчанию: 10485760 / 10MB)

Доступны как: `githubLimits.commentMaxSize`, `githubLimits.fileMaxSize` и т.д.

### 4. Системные лимиты ресурсов (systemLimits)

- `HIVE_MIND_MIN_DISK_SPACE_MB`: Минимальное требуемое дисковое пространство в MB (по умолчанию: 500)
- `HIVE_MIND_DEFAULT_PAGE_SIZE_KB`: Размер страницы памяти по умолчанию в KB (по умолчанию: 16)

Доступны как: `systemLimits.minDiskSpaceMb`, `systemLimits.defaultPageSizeKb`

### 5. Конфигурация повторов (retryLimits)

- `HIVE_MIND_MAX_FORK_RETRIES`: Максимум повторов создания форка (по умолчанию: 5)
- `HIVE_MIND_MAX_VERIFY_RETRIES`: Максимум повторов верификации (по умолчанию: 5)
- `HIVE_MIND_MAX_API_RETRIES`: Максимум повторов API вызовов (по умолчанию: 3)
- `HIVE_MIND_RETRY_BACKOFF_MULTIPLIER`: Множитель отката повторов (по умолчанию: 2)

Доступны как: `retryLimits.maxForkRetries`, `retryLimits.maxVerifyRetries` и т.д.

### 6. Настройки файлов и путей (filePaths)

- `HIVE_MIND_TEMP_DIR`: Путь к временной директории (по умолчанию: /tmp)
- `HIVE_MIND_TASK_INFO_FILENAME`: Имя файла информации о задаче (по умолчанию: CLAUDE.md)
- `HIVE_MIND_PROC_MEMINFO`: Путь к файлу информации о памяти (по умолчанию: /proc/meminfo)

Доступны как: `filePaths.tempDir`, `filePaths.taskInfoFilename` и т.д.

### 7. Обработка текста (textProcessing)

- `HIVE_MIND_TOKEN_MASK_MIN_LENGTH`: Минимальная длина для маскировки токенов (по умолчанию: 12)
- `HIVE_MIND_TOKEN_MASK_START_CHARS`: Символов показывать в начале при маскировке (по умолчанию: 5)
- `HIVE_MIND_TOKEN_MASK_END_CHARS`: Символов показывать в конце при маскировке (по умолчанию: 5)
- `HIVE_MIND_TEXT_PREVIEW_LENGTH`: Длина предпросмотра текста (по умолчанию: 100)
- `HIVE_MIND_LOG_TRUNCATION_LENGTH`: Длина усечения логов (по умолчанию: 5000)

Доступны как: `textProcessing.tokenMaskMinLength`, `textProcessing.textPreviewLength` и т.д.

### 8. Настройки отображения (display)

- `HIVE_MIND_LABEL_WIDTH`: Ширина меток в форматированном выводе (по умолчанию: 25)

Доступно как: `display.labelWidth`

### 9. Отслеживание ошибок Sentry (sentry)

- `HIVE_MIND_SENTRY_DSN`: Sentry DSN для отслеживания ошибок (по умолчанию: предоставлен)
- `HIVE_MIND_SENTRY_TRACES_SAMPLE_RATE_DEV`: Частота выборки трейсов в разработке (по умолчанию: 1.0)
- `HIVE_MIND_SENTRY_TRACES_SAMPLE_RATE_PROD`: Частота выборки трейсов в production (по умолчанию: 0.1)
- `HIVE_MIND_SENTRY_PROFILE_SESSION_SAMPLE_RATE_DEV`: Частота выборки профиля в разработке (по умолчанию: 1.0)
- `HIVE_MIND_SENTRY_PROFILE_SESSION_SAMPLE_RATE_PROD`: Частота выборки профиля в production (по умолчанию: 0.1)

Доступны как: `sentry.dsn`, `sentry.tracesSampleRateDev` и т.д.

### 10. Внешние URL (externalUrls)

- `HIVE_MIND_GITHUB_BASE_URL`: Базовый URL GitHub (по умолчанию: https://github.com)
  - Полезно для инстансов GitHub Enterprise
- `HIVE_MIND_BUN_INSTALL_URL`: URL установки Bun (по умолчанию: https://bun.sh/)

Доступны как: `externalUrls.githubBase`, `externalUrls.bunInstall`

### 11. Конфигурация моделей (modelConfig)

- `HIVE_MIND_AVAILABLE_MODELS`: Список доступных моделей через запятую (по умолчанию: opus,sonnet,claude-sonnet-4-5-20250929,claude-opus-4-1-20250805)
- `HIVE_MIND_DEFAULT_MODEL`: Модель по умолчанию (по умолчанию: sonnet)

Доступны как: `modelConfig.availableModels`, `modelConfig.defaultModel`

### 12. Настройки версии (version)

- `HIVE_MIND_VERSION_FALLBACK`: Резервная версия (по умолчанию: 0.14.3)
- `HIVE_MIND_VERSION_DEFAULT`: Версия по умолчанию (по умолчанию: 0.14.3)

Доступны как: `version.fallback`, `version.default`

## Примеры использования

### Установка переменных окружения

```bash
# Увеличить таймаут Claude до 2 минут
export HIVE_MIND_CLAUDE_TIMEOUT_SECONDS=120

# Уменьшить задержку GitHub API для более быстрых операций
export HIVE_MIND_GITHUB_API_DELAY_MS=2000

# Увеличить порог авто-продолжения до 48 часов
export HIVE_MIND_AUTO_CONTINUE_AGE_HOURS=48

# Использовать пользовательскую временную директорию
export HIVE_MIND_TEMP_DIR=/var/tmp/hive-mind

# Отключить Sentry в production
export HIVE_MIND_SENTRY_DSN=""

# Настроить для GitHub Enterprise
export GITHUB_BASE_URL=https://github.enterprise.com
```

### Запуск с пользовательской конфигурацией

```bash
# Запуск с пользовательскими таймаутами
HIVE_MIND_CLAUDE_TIMEOUT_SECONDS=120 HIVE_MIND_RETRY_BASE_DELAY_MS=10000 hive monitor

# Запуск с увеличенными лимитами
HIVE_MIND_GITHUB_FILE_MAX_SIZE=52428800 HIVE_MIND_MIN_DISK_SPACE_MB=1000 solve https://github.com/owner/repo/issues/123

# Запуск с пользовательскими настройками авто-продолжения
HIVE_MIND_AUTO_CONTINUE_AGE_HOURS=12 solve --auto-continue https://github.com/owner/repo/issues/456
```

### Файл конфигурации (опционально)

Вы также можете создать файл `.env` в корне проекта:

```bash
# Файл .env
HIVE_MIND_CLAUDE_TIMEOUT_SECONDS=90
HIVE_MIND_GITHUB_API_DELAY_MS=3000
HIVE_MIND_AUTO_CONTINUE_AGE_HOURS=36
HIVE_MIND_TEMP_DIR=/opt/hive-mind/tmp
HIVE_MIND_SENTRY_DSN=ваш-пользовательский-sentry-dsn
```

Затем подключите его перед запуском:

```bash
source .env
hive monitor
```

## Использование для разработчиков

### Импорт конфигурации

```javascript
import { timeouts, githubLimits, sentry } from './config.lib.mjs';

// Использовать значения конфигурации
const timeout = timeouts.claudeCli;
const maxSize = githubLimits.fileMaxSize;
const dsn = sentry.dsn;
```

### Получение всей конфигурации

```javascript
import { getAllConfigurations, printConfiguration } from './config.lib.mjs';

// Получить всю конфигурацию как объект
const config = getAllConfigurations();

// Вывести текущую конфигурацию (полезно для отладки)
printConfiguration();
```

### Валидация конфигурации

```javascript
import { validateConfig } from './config.lib.mjs';

try {
  validateConfig();
  console.log('Конфигурация валидна');
} catch (error) {
  console.error('Ошибка конфигурации:', error.message);
}
```

## Примечания

- Конфигурация использует `getenv` из use-m для надёжной обработки переменных окружения
- Все имена свойств используют camelCase для единообразия с соглашениями JavaScript
- Все значения таймаутов в миллисекундах, если не указано иное
- Все лимиты размеров в байтах, если не указано иное
- Частоты выборки должны быть между 0.0 и 1.0
- Приложение валидирует все значения конфигурации при запуске
- Невалидные значения приведут к ошибке приложения с сообщением об ошибке
- Вы можете просмотреть текущую конфигурацию, проверив логи приложения в verbose режиме

## Устранение неполадок

Если у вас возникли проблемы с конфигурацией:

1. Проверьте что числовые значения являются положительными целыми числами
2. Убедитесь что частоты выборки между 0 и 1
3. Проверьте что пути существуют и доступны
4. Запустите с флагом `--verbose` чтобы увидеть используемые значения конфигурации
5. Проверьте логи приложения на ошибки валидации конфигурации
6. Используйте `printConfiguration()` для отладки текущих настроек
