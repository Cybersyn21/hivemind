# Поддержка Docker для Hive Mind Issue Solver

Этот документ объясняет как запустить `solve.mjs` в Docker контейнере с правильной передачей credentials с хост-машины.

## Быстрый старт

### Вариант 1: Использование вспомогательного скрипта (рекомендуется)

```bash
# Собрать и запустить с автоматической передачей credentials
./docker-solve.sh https://github.com/owner/repo/issues/123

# Принудительно пересобрать образ
./docker-solve.sh --build https://github.com/owner/repo/issues/123

# Передать дополнительные аргументы
./docker-solve.sh --verbose --timeout 300 https://github.com/owner/repo/issues/123
```

### Вариант 2: Использование Docker напрямую

```bash
# Собрать образ
docker build -t hive-mind-solver .

# Запустить с монтированием credentials
docker run --rm -it \
    -v ~/.config/gh:/workspace/.persisted-configs/gh:ro \
    -v ~/.local/share/claude-profiles:/workspace/.persisted-configs/claude:ro \
    -v ~/.config/claude-code:/workspace/.persisted-configs/claude-code:ro \
    -v "$(pwd)/output:/workspace/output" \
    -e GITHUB_TOKEN="${GITHUB_TOKEN}" \
    -e CLAUDE_API_KEY="${CLAUDE_API_KEY}" \
    hive-mind-solver \
    bash -c "./docker-restore-auth.sh && ./solve.mjs https://github.com/owner/repo/issues/123"
```

### Вариант 3: Использование Docker Compose

```bash
# Запустить с docker-compose
docker-compose run --rm hive-mind-solver ./solve.mjs https://github.com/owner/repo/issues/123
```

## Передача Credentials

Docker установка автоматически передает credentials с хост-машины в контейнер:

### GitHub Credentials
- **Путь на хосте:** `~/.config/gh`
- **Путь в контейнере:** `/workspace/.persisted-configs/gh`
- **Назначение:** Обеспечивает доступ к GitHub API и операциям с репозиториями

### Claude Profiles
- **Путь на хосте:** `~/.local/share/claude-profiles`
- **Путь в контейнере:** `/workspace/.persisted-configs/claude`
- **Назначение:** Передает конфигурации профилей Claude

### Claude Code Credentials
- **Путь на хосте:** `~/.config/claude-code`
- **Путь в контейнере:** `/workspace/.persisted-configs/claude-code`
- **Назначение:** Обеспечивает доступ к Claude Code API

## Предварительные требования

1. **Docker:** Установите Docker Desktop или Docker Engine
2. **GitHub CLI:** Авторизуйтесь с `gh auth login` на хосте
3. **Claude Credentials:** Настройте Claude profiles или Claude Code на хосте

## Структура директорий

```
.
├── Dockerfile                 # Основное определение Docker образа
├── docker-compose.yml        # Конфигурация Docker Compose
├── docker-solve.sh          # Удобный скрипт-обертка
├── docker-restore-auth.sh    # Скрипт восстановления credentials
└── solve.mjs                 # Основное приложение
```

## Переменные окружения

Вы можете передавать переменные окружения для контроля поведения:

```bash
# Явно установить GitHub токен
export GITHUB_TOKEN="ваш_токен_здесь"

# Установить Claude API ключ
export CLAUDE_API_KEY="ваш_ключ_здесь"

# Запустить с переменными
./docker-solve.sh https://github.com/owner/repo/issues/123
```

## Выходные файлы

Любые файлы, созданные `solve.mjs`, будут доступны в директории `./output/` на вашей хост-машине.

## Устранение неполадок

### Проблемы с аутентификацией GitHub
```bash
# Проверить авторизован ли GitHub CLI на хосте
gh auth status

# Переавторизоваться при необходимости
gh auth login
```

### Проблемы с Claude Credentials
```bash
# Проверить существуют ли Claude profiles
ls -la ~/.local/share/claude-profiles

# Проверить конфиг Claude Code
ls -la ~/.config/claude-code
```

### Проблемы с Docker
```bash
# Проверить статус Docker
docker info

# Пересобрать образ с нуля
./docker-solve.sh --build
```

## Примечания по безопасности

- Credentials монтируются read-only в контейнер
- Контейнер запускается с минимальными привилегиями
- Никакие credentials не хранятся в Docker образе
- Вся передача credentials происходит во время выполнения
