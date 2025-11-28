# Конвертация Sentry Issues в GitHub Issues: Всесторонний анализ

## Обзор

Этот документ исследует все доступные опции для конвертации Sentry issues в GitHub Issues для проекта Hive Mind. Наш инстанс Sentry находится по адресу https://deepassistant.sentry.io/issues.

## Варианты решения

### 1. Нативная интеграция Sentry с GitHub ⭐ Рекомендуется для быстрой настройки

#### Обзор
Sentry предоставляет встроенную интеграцию с GitHub, позволяющую создавать и связывать GitHub issues напрямую из Sentry.

#### Функции

**Ручное создание Issue:**
- Перейдите к любому Sentry issue
- Используйте раздел "Linked Issues" в правой панели
- Кликните для создания нового GitHub issue
- Автоматически предлагает assignees на основе файла CODEOWNERS
- Создает двунаправленную ссылку между Sentry и GitHub

**Автоматическое создание Issue:**
- Настройте Issue Alerts в Sentry
- Добавьте действие "Create a new GitHub issue" к правилам алертов
- GitHub issues создаются автоматически когда срабатывают алерты
- Доступно только для планов Business или Enterprise

#### Шаги настройки

1. Перейдите в Sentry Settings > Integrations
2. Выберите интеграцию GitHub
3. Установите Sentry GitHub App
4. Подключите ваши GitHub репозитории
5. (Опционально) Загрузите файл CODEOWNERS для авто-назначения
6. Настройте Issue Alerts для автоматического создания

#### Плюсы
- ✅ Официальная интеграция поддерживается Sentry
- ✅ Нулевой код требуется
- ✅ Двунаправленное связывание (Sentry ↔ GitHub)
- ✅ Авто-назначение на основе CODEOWNERS
- ✅ Работает с PR комментариями и релизами
- ✅ Быстрая настройка (5-10 минут)

#### Минусы
- ❌ Автоматическое создание требует план Business/Enterprise
- ❌ Ограниченная кастомизация формата issue
- ❌ Требуются ручные клики для бесплатного плана
- ❌ Невозможно массово конвертировать существующие issues

#### Стоимость
- Ручное: Доступно на всех планах (Team, Business, Enterprise)
- Автоматическое: Только планы Business/Enterprise

#### Документация
- https://docs.sentry.io/organization/integrations/source-code-mgmt/github/
- https://sentry.io/integrations/github/

---

### 2. Кастомная реализация с Sentry API + GitHub API ⭐ Рекомендуется для полного контроля

#### Обзор
Построить кастомный скрипт или сервис используя REST API Sentry для получения issues и Octokit GitHub для программного создания issues.

#### Архитектура

```
Sentry API → Кастомный скрипт → GitHub API
    ↓              ↓              ↓
Получить Issues   Трансформация     Создать Issues
```

#### Пример реализации

**Зависимости:**
```bash
npm install @sentry/node octokit
```

**Пример кода:**
```javascript
import { Octokit } from 'octokit';

const SENTRY_API_TOKEN = process.env.SENTRY_API_TOKEN;
const SENTRY_ORG = 'deep-assistant';
const SENTRY_PROJECT = 'hive-mind';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'deep-assistant';
const GITHUB_REPO = 'hive-mind';

const octokit = new Octokit({ auth: GITHUB_TOKEN });

async function fetchSentryIssues() {
  const response = await fetch(
    `https://sentry.io/api/0/projects/${SENTRY_ORG}/${SENTRY_PROJECT}/issues/?query=is:unresolved`,
    {
      headers: {
        'Authorization': `Bearer ${SENTRY_API_TOKEN}`
      }
    }
  );
  return response.json();
}

async function createGitHubIssue(sentryIssue) {
  const { data } = await octokit.rest.issues.create({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    title: `[Sentry] ${sentryIssue.title}`,
    body: `
## Sentry Issue

**Issue URL:** ${sentryIssue.permalink}
**Статус:** ${sentryIssue.status}
**Первый раз замечено:** ${sentryIssue.firstSeen}
**Последний раз замечено:** ${sentryIssue.lastSeen}
**Количество:** ${sentryIssue.count} событий
**Количество пользователей:** ${sentryIssue.userCount} затронуто пользователей

## Детали ошибки

${sentryIssue.metadata?.type || 'N/A'}: ${sentryIssue.metadata?.value || 'N/A'}

---
*Автоматически создано из Sentry*
    `.trim(),
    labels: ['bug', 'sentry', 'automated']
  });
  return data;
}

async function main() {
  const sentryIssues = await fetchSentryIssues();

  for (const issue of sentryIssues) {
    try {
      const githubIssue = await createGitHubIssue(issue);
      console.log(`Создан GitHub issue #${githubIssue.number} для Sentry issue ${issue.id}`);
    } catch (error) {
      console.error(`Не удалось создать issue для ${issue.id}:`, error);
    }
  }
}

main();
```

#### Шаги настройки

1. Создать Sentry Auth Token (Settings > Account > API > Auth Tokens)
2. Создать GitHub Personal Access Token с правами `repo`
3. Установить зависимости: `npm install octokit`
4. Создать скрипт с аутентификацией
5. Запустить вручную или запланировать с cron/GitHub Actions

#### Детали Sentry API

**Endpoint:** `GET /api/0/projects/{org_slug}/{project_slug}/issues/`

**Аутентификация:** Bearer токен в заголовке Authorization

**Ключевые параметры:**
- `query`: Фильтр issues (например, `is:unresolved`, `is:unresolved is:for_review`)
- `statsPeriod`: Временной диапазон (`24h`, `14d`)
- `cursor`: Пагинация

**Ответ включает:**
- ID Issue, название, статус
- Метки времени первого и последнего обнаружения
- Количество событий, количество пользователей
- Метаданные (тип ошибки, значение)
- Ссылка на Sentry UI

#### Детали GitHub API

**Endpoint:** `POST /repos/{owner}/{repo}/issues`

**Аутентификация:** Personal Access Token

**Параметры:**
- `title`: Название issue (обязательно)
- `body`: Описание issue (опционально)
- `labels`: Массив имен меток
- `assignees`: Массив GitHub имен пользователей
- `milestone`: Номер milestone

#### Плюсы
- ✅ Полный контроль над форматом и содержанием issue
- ✅ Возможность массовой конверсии существующих issues
- ✅ Настраиваемая фильтрация и трансформация
- ✅ Можно добавить кастомные метки, assignees, milestones
- ✅ Работает с бесплатным планом Sentry
- ✅ Может быть запланирован или event-driven
- ✅ Уже установлен @sentry/node

#### Минусы
- ❌ Требует разработки и обслуживания
- ❌ Нужно обрабатывать ограничение скорости
- ❌ Нужно отслеживать какие issues уже конвертированы
- ❌ Нет двунаправленной синхронизации из коробки

#### Стоимость
- Бесплатно (использует Sentry API + GitHub API)

#### Документация
- Sentry API: https://docs.sentry.io/api/events/list-a-projects-issues/
- GitHub Octokit: https://github.com/octokit/octokit.js
- GitHub Issues API: https://docs.github.com/en/rest/issues/issues

---

### 3. Sentry Webhooks + Кастомный сервис ⭐ Рекомендуется для реального времени

#### Обзор
Использовать интеграцию webhook Sentry для получения уведомлений в реальном времени когда issues создаются или обновляются, затем автоматически создавать GitHub issues.

#### Архитектура

```
Sentry Issue Создан/Обновлен
         ↓
   Sentry Webhook
         ↓
   Ваш Web сервис (Express.js)
         ↓
   GitHub API (Создать Issue)
```

#### Пример реализации

**Зависимости:**
```bash
npm install express octokit
```

**Пример кода:**
```javascript
import express from 'express';
import { Octokit } from 'octokit';

const app = express();
app.use(express.json());

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

app.post('/sentry-webhook', async (req, res) => {
  const resource = req.headers['sentry-hook-resource'];
  const action = req.body.action;

  if (resource === 'issue' && action === 'created') {
    const sentryIssue = req.body.data.issue;

    await octokit.rest.issues.create({
      owner: 'deep-assistant',
      repo: 'hive-mind',
      title: `[Sentry] ${sentryIssue.title}`,
      body: `
Sentry Issue: ${sentryIssue.web_url}
Статус: ${sentryIssue.status}

${sentryIssue.metadata?.type}: ${sentryIssue.metadata?.value}
      `.trim(),
      labels: ['bug', 'sentry', 'automated']
    });
  }

  res.status(200).send('OK');
});

app.listen(3000);
```

#### Payload Webhook

**Заголовок:** `Sentry-Hook-Resource: issue`

**Действия:** `created`, `resolved`, `assigned`, `archived`, `unresolved`

**Payload включает:**
- URL Issue, URL проекта
- Статус и подстатус
- Детали статуса (информация о разрешении)
- Полные метаданные issue

#### Шаги настройки

1. Создать internal integration в Sentry (Settings > Custom Integrations)
2. Настроить webhook URL (ваш публичный endpoint)
3. Подписаться на события "Issue"
4. Развернуть сервис приема webhook
5. Тестировать с примерами issues

#### Плюсы
- ✅ Создание issue в реальном времени (мгновенное)
- ✅ Event-driven, не нужен опрос
- ✅ Может реагировать на изменения статуса (resolved, reopened)
- ✅ Низкое использование ресурсов
- ✅ Масштабируемая архитектура

#### Минусы
- ❌ Требует хостинга web сервиса
- ❌ Нужен публичный HTTPS endpoint
- ❌ Более сложная настройка
- ❌ Нужно обрабатывать повторы webhook и сбои

#### Стоимость
- Бесплатно (Sentry webhooks + GitHub API)
- Стоимость хостинга для webhook сервиса (варьируется)

#### Документация
- https://docs.sentry.io/organization/integrations/integration-platform/webhooks/issues/

---

### 4. Платформы автоматизации третьих сторон

#### 4.1 Pipedream ⭐ Самый простой вариант без кода

**Обзор:** Low-code платформа с готовыми Sentry → GitHub рабочими процессами

**Функции:**
- Готовые шаблоны рабочих процессов
- "Create GitHub Issue on New Sentry Issue Event"
- Визуальный конструктор рабочих процессов
- Встроенная аутентификация для обоих сервисов
- Serverless выполнение

**Настройка:**
1. Зарегистрируйтесь на https://pipedream.com
2. Выберите триггер "Sentry API": "New Issue Event (Instant)"
3. Добавьте действие "GitHub API": "Create Issue"
4. Сопоставьте поля из Sentry в GitHub
5. Разверните рабочий процесс

**Плюсы:**
- ✅ Нулевой код требуется
- ✅ Готовые шаблоны доступны
- ✅ Визуальный конструктор рабочих процессов
- ✅ Доступен бесплатный тариф (100 вызовов/день)
- ✅ Включен управляемый хостинг

**Минусы:**
- ❌ Ограниченная кастомизация на бесплатном тарифе
- ❌ Привязка к вендору
- ❌ Лимиты использования на бесплатном плане

**Стоимость:** Бесплатный тариф (100 вызовов/день), Платный ($19/мес+)

**URL:** https://pipedream.com/apps/sentry/integrations/github

---

#### 4.2 n8n - Self-hosted альтернатива

**Обзор:** Open-source автоматизация рабочих процессов, self-hosted

**Функции:**
- Визуальный конструктор рабочих процессов
- Доступны узлы Sentry + GitHub
- Self-hosted (полный контроль)
- Может работать на вашей инфраструктуре

**Настройка:**
1. Развернуть n8n (Docker/npm)
2. Создать рабочий процесс с триггером Sentry
3. Добавить узел GitHub "Create Issue"
4. Настроить сопоставления полей
5. Активировать рабочий процесс

**Плюсы:**
- ✅ Open-source и бесплатный
- ✅ Self-hosted (данные остаются с вами)
- ✅ Неограниченное выполнение
- ✅ Полная кастомизация
- ✅ SOC2 совместимый

**Минусы:**
- ❌ Требует хостинга/инфраструктуры
- ❌ Более сложная настройка
- ❌ Самостоятельное обслуживание

**Стоимость:** Бесплатно (self-hosted) или Cloud ($20/мес+)

**URL:** https://n8n.io/integrations/github/and/sentryio/

---

#### 4.3 Make.com (ранее Integromat)

**Обзор:** Визуальная платформа автоматизации с поддержкой Sentry и GitHub

**Функции:**
- Визуальный конструктор сценариев
- Модуль Sentry: получение issues
- Модуль GitHub: создание issues, PRs, комментариев
- Продвинутая маршрутизация и фильтрация

**Настройка:**
1. Зарегистрируйтесь на https://www.make.com
2. Создайте новый сценарий
3. Добавьте модуль Sentry (триггер или действие)
4. Добавьте модуль GitHub "Create Issue"
5. Сопоставьте поля данных
6. Запустите сценарий

**Плюсы:**
- ✅ Визуальный no-code конструктор
- ✅ Продвинутые функции (маршрутизация, фильтрация)
- ✅ Бесплатный тариф (1,000 операций/мес)
- ✅ Хорошая документация

**Минусы:**
- ❌ Более крутая кривая обучения
- ❌ Сложная модель ценообразования
- ❌ Ограниченные операции на бесплатном тарифе

**Стоимость:** Бесплатный тариф (1,000 опер/мес), Платный ($9/мес+)

**URLs:**
- Sentry: https://www.make.com/en/integrations/sentry
- GitHub: https://www.make.com/en/integrations/github

---

#### 4.4 Zapier - Больше всего интеграций

**Обзор:** Лидер рынка в автоматизации с 7,000+ приложений

**Функции:**
- Простой конструктор рабочих процессов (Zaps)
- Доступна интеграция Sentry
- Доступна интеграция GitHub
- Лучше для бизнес-пользователей

**Настройка:**
1. Зарегистрируйтесь на https://zapier.com
2. Создайте новый Zap
3. Триггер: Sentry (требуется настройка webhook)
4. Действие: GitHub "Create Issue"
5. Сопоставьте поля и включите

**Плюсы:**
- ✅ Проще всего для нетехнических пользователей
- ✅ Самая зрелая платформа
- ✅ Обширная экосистема приложений
- ✅ Отличная поддержка и документация

**Минусы:**
- ❌ Более дорогой
- ❌ Ограниченная интеграция Sentry
- ❌ Очень ограниченный бесплатный тариф (100 задач/мес)

**Стоимость:** Бесплатный тариф (100 задач/мес), Платный ($19.99/мес+)

---

### 5. Кастомный рабочий процесс GitHub Actions

#### Обзор
Создать запланированный GitHub Action, который опрашивает Sentry API и создает issues

#### Пример реализации

**.github/workflows/sentry-sync.yml:**
```yaml
name: Sync Sentry Issues to GitHub

on:
  schedule:
    - cron: '0 */6 * * *'  # Каждые 6 часов
  workflow_dispatch:  # Ручной триггер

jobs:
  sync-issues:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm install octokit

      - name: Sync Sentry Issues
        env:
          SENTRY_API_TOKEN: ${{ secrets.SENTRY_API_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: node scripts/sync-sentry-issues.js
```

**scripts/sync-sentry-issues.js:**
```javascript
import { Octokit } from 'octokit';
import fs from 'fs';

const SYNCED_ISSUES_FILE = 'synced-sentry-issues.json';

async function main() {
  const synced = fs.existsSync(SYNCED_ISSUES_FILE)
    ? JSON.parse(fs.readFileSync(SYNCED_ISSUES_FILE))
    : {};

  const sentryIssues = await fetchSentryIssues();
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  for (const issue of sentryIssues) {
    if (synced[issue.id]) continue;

    const ghIssue = await octokit.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: `[Sentry] ${issue.title}`,
      body: createIssueBody(issue),
      labels: ['bug', 'sentry']
    });

    synced[issue.id] = ghIssue.data.number;
    fs.writeFileSync(SYNCED_ISSUES_FILE, JSON.stringify(synced));
  }
}

main();
```

#### Плюсы
- ✅ Запускается автоматически по расписанию
- ✅ Не нужны внешние сервисы
- ✅ Бесплатно (минуты GitHub Actions)
- ✅ Код живет в репозитории
- ✅ Легко версионировать

#### Минусы
- ❌ На основе опроса (не реальное время)
- ❌ Требует управления состоянием
- ❌ Ограничено расписанием cron
- ❌ Соображения ограничения скорости

#### Стоимость
- Бесплатно (в рамках лимитов GitHub Actions)

---

## Матрица сравнения

| Решение | Время настройки | Стоимость | Реальное время | Кастомизация | Обслуживание | Лучше для |
|----------|-----------|------|-----------|---------------|-------------|----------|
| **Нативная интеграция (Ручная)** | 10 мин | Бесплатно | Нет | Низкая | Нет | Быстрая настройка, малые команды |
| **Нативная интеграция (Авто)** | 15 мин | $$ | Да | Низкая | Нет | Enterprise, автоматизированный рабочий процесс |
| **Кастомный скрипт (API)** | 2-4 часа | Бесплатно | Нет | Высокая | Средняя | Полный контроль, массовые операции |
| **Webhooks + Сервис** | 4-8 часов | Хостинг | Да | Высокая | Высокая | Реальное время, большой масштаб |
| **Pipedream** | 30 мин | Бесплатно/$ | Да | Средняя | Низкая | No-code, быстрое прототипирование |
| **n8n** | 2-3 часа | Бесплатно* | Да | Высокая | Средняя | Self-hosted, приватность данных |
| **Make.com** | 1 час | Бесплатно/$ | Да | Высокая | Низкая | Сложные рабочие процессы |
| **Zapier** | 30 мин | $$ | Да | Средняя | Низкая | Бизнес-пользователи, простота |
| **GitHub Actions** | 2-3 часа | Бесплатно | Нет | Высокая | Средняя | CI/CD интеграция |

\* Требует инфраструктуру хостинга

---

## Рекомендации

### Для немедленного использования (на этой неделе)
**→ Нативная интеграция Sentry с GitHub (Ручная)**

Начните с официальной интеграции для быстрых побед:
1. Установка за 10 минут
2. Тестируйте с несколькими issues вручную
3. Оцените стоит ли автоматическая версия обновления плана

### Для production использования (долгосрочно)

**→ Кастомная реализация (Sentry API + GitHub API)**

Рекомендуется потому что:
1. ✅ **Уже есть зависимость @sentry/node** - используйте существующую интеграцию
2. ✅ **Полный контроль** - кастомизируйте формат issue, метки, логику назначения
3. ✅ **Можно интегрировать с Hive Mind** - добавить к существующему набору автоматизации
4. ✅ **Бесплатно** - нет дополнительных затрат на подписку
5. ✅ **Можно развивать** - начните просто, добавляйте функции со временем
6. ✅ **Массовые операции** - можно конвертировать существующие issues

**План реализации:**
1. Создать скрипт `scripts/sentry-to-github.mjs`
2. Использовать существующие Sentry credentials
3. Добавить к npm скриптам: `"sentry:sync": "node scripts/sentry-to-github.mjs"`
4. Запланировать с cron или GitHub Actions
5. (Опционально) Расширить до webhook для реального времени

### Для требований реального времени

**→ Sentry Webhooks + Кастомный сервис**

Если критично реальное время:
1. Расширить кастомный скрипт до приемника webhook
2. Развернуть как микросервис (та же инфраструктура что hive-mind)
3. Использовать существующий pipeline развертывания

### Для быстрого прототипа без кода

**→ Pipedream**

Если хотите тестировать перед обязательством кастомному коду:
1. Бесплатного тарифа достаточно для тестирования
2. Можно экспортировать/мигрировать логику позже
3. Хорошо для понимания потока данных

---

## Соображения реализации

### Дедупликация
Отслеживайте синхронизированные issues для избежания дубликатов:
```javascript
const syncedIssues = new Map(); // sentryId -> githubIssueNumber
```

### Ограничение скорости
- Sentry API: Нет документированного лимита, но будьте разумны
- GitHub API: 5,000 запросов/час для аутентифицированных запросов
- Добавьте задержки между массовыми операциями

### Синхронизация статуса Issue
Рассмотрите двунаправленную синхронизацию:
- Sentry issue разрешен → Закрыть GitHub issue
- GitHub issue закрыт → Обновить статус Sentry issue

### Метки и назначение
- Добавьте метку `sentry` для фильтрации
- Парсите тип ошибки для дополнительных меток (например, `TypeError`, `network-error`)
- Используйте Sentry fingerprint/данные пользователя для назначения

### Обработка ошибок
- Логируйте сбои для ручной проверки
- Повторяйте временные ошибки (проблемы сети)
- Алерт при постоянных сбоях

---

## Следующие шаги

1. **Немедленно:** Установить интеграцию Sentry GitHub для ручного тестирования
2. **Неделя 1:** Построить кастомный скрипт для массовой конверсии существующих issues
3. **Недели 2-3:** Добавить планирование (GitHub Actions или cron)
4. **Будущее:** Рассмотреть webhook синхронизацию в реальном времени при необходимости

---

## Ссылки

### Документация Sentry
- Интеграция GitHub: https://docs.sentry.io/organization/integrations/source-code-mgmt/github/
- Справочник API: https://docs.sentry.io/api/
- List Issues: https://docs.sentry.io/api/events/list-a-projects-issues/
- Webhooks: https://docs.sentry.io/organization/integrations/integration-platform/webhooks/issues/
- Auth Tokens: https://docs.sentry.io/api/guides/create-auth-token/

### Документация GitHub
- REST API: https://docs.github.com/en/rest
- Octokit.js: https://github.com/octokit/octokit.js
- Create Issue: https://docs.github.com/en/rest/issues/issues#create-an-issue

### Платформы третьих сторон
- Pipedream: https://pipedream.com/apps/sentry/integrations/github
- n8n: https://n8n.io/integrations/github/and/sentryio/
- Make.com: https://www.make.com/en/integrations/sentry
- Zapier: https://zapier.com

### Ресурсы сообщества
- Stack Overflow: https://stackoverflow.com/questions/79186277/is-there-a-github-action-to-fetch-sentry-issues-and-create-github-issues
- Sentry GitHub App: https://github.com/apps/sentry-io
