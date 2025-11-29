# Автоматизация с N8N | Inmobiliaria Casella & Casella

## Обзор

Этот документ описывает автоматизацию создания страниц недвижимости и публикации в социальных сетях с использованием **N8N** - открытой low-code платформы для автоматизации workflow.

## Преимущества N8N

### Почему N8N?

1. **Open Source** - бесплатная альтернатива Zapier/Make
2. **Self-hosted** - полный контроль над данными
3. **Визуальный редактор** - создание workflow без кода
4. **400+ интеграций** - готовые ноды для популярных сервисов
5. **Расширяемость** - возможность создавать собственные ноды
6. **Webhook поддержка** - легкая интеграция с Telegram
7. **JavaScript/Python код** - возможность выполнять кастомный код
8. **Database хранение** - сохранение данных между выполнениями

### Сравнение с другими решениями

| Функция | N8N | Make.com | Zapier | Custom Bot |
|---------|-----|----------|--------|------------|
| Стоимость | Бесплатно (self-hosted) | От $9/мес | От $20/мес | Хостинг ($5-10/мес) |
| Визуальный редактор | ✅ | ✅ | ✅ | ❌ |
| Self-hosted | ✅ | ❌ | ❌ | ✅ |
| Кастомный код | ✅ | ✅ | ⚠️ Ограниченно | ✅ |
| Сложность настройки | Средняя | Низкая | Низкая | Высокая |
| Гибкость | Высокая | Средняя | Средняя | Очень высокая |

## Архитектура решения

```
Telegram Bot
    ↓
N8N Webhook
    ↓
├─→ Обработка фото (Cloudflare Images)
├─→ AI генерация описания (OpenAI)
├─→ Генерация HTML (шаблонизация)
├─→ Commit в GitHub
└─→ Уведомление в Telegram
    ↓
Cloudflare Pages (автодеплой)
```

## Установка N8N

### Вариант 1: Docker (рекомендуется)

```bash
# Создайте docker-compose.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_secure_password
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://your-domain.com/
      - GENERIC_TIMEZONE=America/Argentina/Buenos_Aires
    volumes:
      - ./n8n-data:/home/node/.n8n
      - ./n8n-files:/files

# Запустите
docker-compose up -d
```

### Вариант 2: Railway.app (облачный хостинг)

1. Зарегистрируйтесь на [Railway.app](https://railway.app)
2. Создайте новый проект
3. Выберите N8N из Templates
4. Установите переменные окружения
5. Deploy!

**Преимущества Railway:**
- ✅ Бесплатный tier ($5 кредита/месяц)
- ✅ Автоматический SSL
- ✅ Один клик деплой
- ✅ Встроенный PostgreSQL

### Вариант 3: VPS (полный контроль)

```bash
# На сервере Ubuntu
# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка N8N
npm install n8n -g

# Создание systemd сервиса
sudo nano /etc/systemd/system/n8n.service
```

Содержимое `n8n.service`:
```ini
[Unit]
Description=N8N Workflow Automation
After=network.target

[Service]
Type=simple
User=n8n
WorkingDirectory=/home/n8n
Environment="N8N_PORT=5678"
Environment="N8N_PROTOCOL=https"
Environment="WEBHOOK_URL=https://your-domain.com/"
Environment="N8N_BASIC_AUTH_ACTIVE=true"
Environment="N8N_BASIC_AUTH_USER=admin"
Environment="N8N_BASIC_AUTH_PASSWORD=your_password"
ExecStart=/usr/bin/n8n start

[Install]
WantedBy=multi-user.target
```

```bash
# Запуск сервиса
sudo systemctl enable n8n
sudo systemctl start n8n
```

## Настройка Telegram Bot

### 1. Создание бота

```
1. Откройте @BotFather в Telegram
2. Отправьте /newbot
3. Выберите имя: "Casella Properties Bot"
4. Выберите username: "casella_properties_bot"
5. Сохраните токен: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

### 2. Настройка Webhook

В N8N создайте новый workflow и добавьте ноду **Telegram Trigger**:

```json
{
  "name": "Telegram Trigger",
  "type": "n8n-nodes-base.telegramTrigger",
  "credentials": {
    "telegramApi": "Casella Bot"
  },
  "parameters": {
    "updates": ["message"]
  }
}
```

## N8N Workflow: Создание страницы недвижимости

### Полный Workflow

```json
{
  "name": "Casella Property Creator",
  "nodes": [
    {
      "id": "1",
      "name": "Telegram Trigger",
      "type": "n8n-nodes-base.telegramTrigger",
      "position": [250, 300]
    },
    {
      "id": "2",
      "name": "Check Command",
      "type": "n8n-nodes-base.switch",
      "position": [450, 300]
    },
    {
      "id": "3",
      "name": "Start Property Flow",
      "type": "n8n-nodes-base.set",
      "position": [650, 200]
    },
    {
      "id": "4",
      "name": "Process Photos",
      "type": "n8n-nodes-base.function",
      "position": [850, 200]
    },
    {
      "id": "5",
      "name": "Upload to Cloudflare",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1050, 200]
    },
    {
      "id": "6",
      "name": "Generate Description (OpenAI)",
      "type": "n8n-nodes-base.openAi",
      "position": [1250, 200]
    },
    {
      "id": "7",
      "name": "Create HTML",
      "type": "n8n-nodes-base.function",
      "position": [1450, 200]
    },
    {
      "id": "8",
      "name": "Commit to GitHub",
      "type": "n8n-nodes-base.github",
      "position": [1650, 200]
    },
    {
      "id": "9",
      "name": "Send Confirmation",
      "type": "n8n-nodes-base.telegram",
      "position": [1850, 200]
    }
  ]
}
```

### Пошаговая настройка

#### Нода 1: Telegram Trigger

Принимает сообщения из Telegram.

**Настройка:**
- Updates: `message`
- Additional Fields: Download Media Files = `true`

#### Нода 2: Switch (проверка команды)

Определяет тип команды от пользователя.

**Rules:**
```javascript
// Route 1: /new_property
{{ $json.message.text }} === '/new_property'

// Route 2: Фотографии
{{ $json.message.photo !== undefined }}

// Route 3: Текстовые данные
{{ $json.message.text && !$json.message.text.startsWith('/') }}

// Route 4: /done
{{ $json.message.text }} === '/done'
```

#### Нода 3: Set (инициализация)

Создает структуру данных для объекта.

**Values:**
```javascript
{
  "propertyData": {
    "userId": "={{ $json.message.from.id }}",
    "photos": [],
    "step": "category",
    "category": "",
    "title": "",
    "price": "",
    "location": "",
    "bedrooms": "",
    "bathrooms": "",
    "area": "",
    "features": []
  }
}
```

#### Нода 4: Process Photos (Function)

Обрабатывает загруженные фотографии.

**JavaScript код:**
```javascript
// Получаем данные пользователя из предыдущих выполнений
const userId = $input.item.json.message.from.id;
const photo = $input.item.json.message.photo;

// Получаем largest photo
const largestPhoto = photo[photo.length - 1];

// Скачиваем фото
const fileId = largestPhoto.file_id;
const telegramToken = $node["Telegram Trigger"].credentials.token;

// Получаем file_path
const fileInfoUrl = `https://api.telegram.org/bot${telegramToken}/getFile?file_id=${fileId}`;
const fileInfoResponse = await $http.get(fileInfoUrl);
const filePath = fileInfoResponse.data.result.file_path;

// Скачиваем файл
const fileUrl = `https://api.telegram.org/file/bot${telegramToken}/${filePath}`;
const fileData = await $http.get(fileUrl, { responseType: 'arraybuffer' });

// Возвращаем данные для загрузки в Cloudflare
return {
  json: {
    userId: userId,
    photoData: Buffer.from(fileData.data).toString('base64'),
    fileName: `property_${userId}_${Date.now()}.jpg`
  }
};
```

#### Нода 5: Upload to Cloudflare Images

Загружает фото в Cloudflare Images.

**HTTP Request настройки:**
```
Method: POST
URL: https://api.cloudflare.com/client/v4/accounts/{{ $env.CLOUDFLARE_ACCOUNT_ID }}/images/v1
Authentication: Header Auth
  - Name: Authorization
  - Value: Bearer {{ $env.CLOUDFLARE_API_TOKEN }}

Body:
  - Type: Form-Data
  - Parameters:
    - file: ={{ $json.photoData }}
    - filename: ={{ $json.fileName }}
```

**Response:**
```javascript
{
  "result": {
    "id": "2cdc28f0-017a-49c4-9ed7-87056c83901f",
    "filename": "property_123_1234567890.jpg",
    "variants": [
      "https://imagedelivery.net/xxx/2cdc28f0-017a-49c4-9ed7-87056c83901f/public"
    ]
  }
}
```

#### Нода 6: OpenAI (генерация описания)

Генерирует профессиональное описание недвижимости.

**Настройки:**
```
Resource: Message
Operation: Create

Model: gpt-4
Messages:
  - Role: System
    Content: "Eres un experto en marketing inmobiliario en Argentina, específicamente en Villa Mercedes, San Luis. Creas descripciones profesionales y atractivas para propiedades."

  - Role: User
    Content: |
      Crea una descripción profesional para esta propiedad:

      Categoría: {{ $json.propertyData.category }}
      Ubicación: {{ $json.propertyData.location }}
      Dormitorios: {{ $json.propertyData.bedrooms }}
      Baños: {{ $json.propertyData.bathrooms }}
      Superficie: {{ $json.propertyData.area }} m²
      Precio: {{ $json.propertyData.price }}

      La descripción debe tener 3-4 párrafos, destacar características clave,
      ubicación, y motivar al cliente a contactar.

      Usa terminología argentina (departamento, cochera, expensas, etc.)

Options:
  - Temperature: 0.7
  - Max Tokens: 500
```

#### Нода 7: Create HTML (Function)

Генерирует HTML страницу из шаблона.

**JavaScript код:**
```javascript
// Получаем данные
const propertyData = $json.propertyData;
const description = $json.choices[0].message.content;
const photoUrls = $json.uploadedPhotos; // Массив URL фотографий

// Читаем шаблон (предварительно загружен в N8N)
const template = $node["Read Template"].json.content;

// Генерируем slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const slug = generateSlug(propertyData.title);

// Генерируем галерею фотографий
let photosHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">\n';

// Главное фото
if (photoUrls.length > 0) {
  photosHtml += `  <div class="md:col-span-2">
    <img src="${photoUrls[0]}" alt="${propertyData.title}" class="w-full h-96 object-cover rounded-xl">
  </div>\n`;
}

// Остальные фото
for (let i = 1; i < photoUrls.length; i++) {
  photosHtml += `  <img src="${photoUrls[i]}" alt="Foto ${i}" class="w-full h-64 object-cover rounded-xl">\n`;
}

photosHtml += '</div>';

// Генерируем HTML характеристик
let featuresHtml = '<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">\n';

if (propertyData.bedrooms) {
  featuresHtml += `
  <div class="flex items-center p-4 bg-gray-50 rounded-lg">
    <i class="fas fa-bed text-primary text-2xl mr-3"></i>
    <div>
      <p class="text-sm text-gray-600">Dormitorios</p>
      <p class="font-bold">${propertyData.bedrooms}</p>
    </div>
  </div>\n`;
}

if (propertyData.bathrooms) {
  featuresHtml += `
  <div class="flex items-center p-4 bg-gray-50 rounded-lg">
    <i class="fas fa-bath text-primary text-2xl mr-3"></i>
    <div>
      <p class="text-sm text-gray-600">Baños</p>
      <p class="font-bold">${propertyData.bathrooms}</p>
    </div>
  </div>\n`;
}

if (propertyData.area) {
  featuresHtml += `
  <div class="flex items-center p-4 bg-gray-50 rounded-lg">
    <i class="fas fa-ruler-combined text-primary text-2xl mr-3"></i>
    <div>
      <p class="text-sm text-gray-600">Superficie</p>
      <p class="font-bold">${propertyData.area} m²</p>
    </div>
  </div>\n`;
}

featuresHtml += '</div>';

// Заменяем плейсхолдеры
let html = template
  .replace(/{{TITLE}}/g, propertyData.title)
  .replace(/{{PRICE}}/g, propertyData.price)
  .replace(/{{LOCATION}}/g, propertyData.location)
  .replace(/{{CATEGORY}}/g, propertyData.category)
  .replace(/{{PHOTOS}}/g, photosHtml)
  .replace(/{{DESCRIPTION}}/g, description)
  .replace(/{{FEATURES}}/g, featuresHtml);

// Возвращаем результат
return {
  json: {
    fileName: `${slug}.html`,
    content: html,
    category: propertyData.category,
    propertyData: propertyData
  }
};
```

#### Нода 8: GitHub (создание файла)

Коммитит HTML файл в GitHub репозиторий.

**Настройки:**
```
Resource: File
Operation: Create

Owner: Cybersyn21
Repository: casella.casa
File Path: properties/{{ $json.category }}/{{ $json.fileName }}
Commit Message: Add property: {{ $json.propertyData.title }}

File Content: {{ $json.content }}
Branch: main
```

**Credentials:**
```
Authentication: Personal Access Token
Token: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Нода 9: Telegram Send Message

Отправляет подтверждение пользователю.

**Настройки:**
```
Resource: Message
Operation: Send Message

Chat ID: {{ $json.propertyData.userId }}
Text: |
  ✅ Propiedad publicada exitosamente!

  🏠 {{ $json.propertyData.title }}
  📍 {{ $json.propertyData.location }}
  💰 {{ $json.propertyData.price }}

  🔗 URL: https://casella.casa/properties/{{ $json.category }}/{{ $json.fileName }}

  La página estará disponible en 1-2 minutos después del deploy automático.

Additional Fields:
  - Parse Mode: Markdown
```

## Управление состоянием пользователя

### Использование N8N Database

N8N позволяет сохранять состояние между выполнениями:

**Нода: Get User State**
```javascript
// Function нода для получения состояния
const userId = $input.item.json.message.from.id;

// Используем встроенное хранилище N8N
const workflowStaticData = this.getWorkflowStaticData('global');

if (!workflowStaticData.users) {
  workflowStaticData.users = {};
}

if (!workflowStaticData.users[userId]) {
  workflowStaticData.users[userId] = {
    step: 'idle',
    photos: [],
    data: {}
  };
}

return {
  json: {
    userId: userId,
    userState: workflowStaticData.users[userId]
  }
};
```

**Нода: Update User State**
```javascript
// Function нода для обновления состояния
const userId = $json.userId;
const newState = $json.newState;

const workflowStaticData = this.getWorkflowStaticData('global');
workflowStaticData.users[userId] = {
  ...workflowStaticData.users[userId],
  ...newState
};

return {
  json: {
    success: true,
    userState: workflowStaticData.users[userId]
  }
};
```

### Альтернатива: PostgreSQL

Для более надежного хранения используйте PostgreSQL:

**SQL Schema:**
```sql
CREATE TABLE user_sessions (
  user_id BIGINT PRIMARY KEY,
  step VARCHAR(50),
  category VARCHAR(50),
  photos JSONB,
  property_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
```

**N8N Postgres нода:**
```javascript
// Query
INSERT INTO user_sessions (user_id, step, property_data)
VALUES (
  {{ $json.userId }},
  'awaiting_photos',
  '{{ JSON.stringify($json.propertyData) }}'
)
ON CONFLICT (user_id)
DO UPDATE SET
  step = EXCLUDED.step,
  property_data = EXCLUDED.property_data,
  updated_at = NOW();
```

## Генерация постов для соцсетей

### OpenAI нода для соцсетей

**Настройка:**
```
Model: gpt-4
System Message: "Creas contenido atractivo para redes sociales de una inmobiliaria en Argentina."

User Message: |
  Crea publicaciones para estas redes sociales sobre la propiedad:

  {{ $json.propertyData.title }}
  {{ $json.propertyData.location }}
  {{ $json.propertyData.price }}

  Genera 3 versiones:

  1. WHATSAPP (conciso, emojis, máx 200 caracteres)
  2. INSTAGRAM (atractivo, hashtags)
  3. FACEBOOK (detallado, profesional)

  Formato JSON:
  {
    "whatsapp": "texto",
    "instagram": "texto",
    "facebook": "texto"
  }

Response Format: JSON Object
```

### Split Into Items (разделение на сообщения)

Разделяет ответ AI на отдельные сообщения для каждой соцсети.

### Send to User (отправка постов)

```
Text: |
  📱 CONTENIDO PARA REDES SOCIALES

  ━━━━━━━━━━━━━━━━━━━━━━
  📲 WHATSAPP:
  {{ $json.whatsapp }}

  ━━━━━━━━━━━━━━━━━━━━━━
  📷 INSTAGRAM:
  {{ $json.instagram }}

  ━━━━━━━━━━━━━━━━━━━━━━
  📘 FACEBOOK:
  {{ $json.facebook }}

  Copia y pega el contenido en cada red social.
```

## Диалоговая логика (Conversational Flow)

### State Machine для диалога

```javascript
// Function: Handle User Message
const userId = $json.message.from.id;
const text = $json.message.text;
const workflowStaticData = this.getWorkflowStaticData('global');

if (!workflowStaticData.users) workflowStaticData.users = {};
if (!workflowStaticData.users[userId]) {
  workflowStaticData.users[userId] = { step: 'idle', data: {} };
}

const userState = workflowStaticData.users[userId];
let response = '';
let nextStep = userState.step;

switch (userState.step) {
  case 'idle':
    if (text === '/new_property') {
      response = 'Seleccione la categoría:\n\n1. Venta\n2. Alquiler\n3. Terrenos\n4. Comercial';
      nextStep = 'awaiting_category';
    } else {
      response = 'Use /new_property para agregar una propiedad';
    }
    break;

  case 'awaiting_category':
    const categories = {
      '1': 'venta',
      '2': 'alquiler',
      '3': 'terrenos',
      '4': 'comercial'
    };

    if (categories[text]) {
      userState.data.category = categories[text];
      response = `Categoría seleccionada: ${categories[text]}\n\nEnvíe las fotos de la propiedad (puede enviar varias). Cuando termine, escriba /done`;
      nextStep = 'awaiting_photos';
    } else {
      response = 'Opción inválida. Seleccione 1, 2, 3 o 4';
    }
    break;

  case 'awaiting_photos':
    if (text === '/done') {
      if (userState.data.photos && userState.data.photos.length > 0) {
        response = 'Ingrese el título de la propiedad:';
        nextStep = 'awaiting_title';
      } else {
        response = 'Debe enviar al menos una foto antes de continuar';
      }
    } else {
      response = 'Envíe las fotos o escriba /done para continuar';
    }
    break;

  case 'awaiting_title':
    userState.data.title = text;
    response = 'Ingrese el precio (o escriba "Consultar"):';
    nextStep = 'awaiting_price';
    break;

  case 'awaiting_price':
    userState.data.price = text;
    response = 'Ingrese la ubicación (ej: Barrio Norte, Villa Mercedes):';
    nextStep = 'awaiting_location';
    break;

  case 'awaiting_location':
    userState.data.location = text;

    if (userState.data.category === 'venta' || userState.data.category === 'alquiler') {
      response = 'Ingrese cantidad de dormitorios:';
      nextStep = 'awaiting_bedrooms';
    } else {
      response = 'Ingrese la superficie en m²:';
      nextStep = 'awaiting_area';
    }
    break;

  case 'awaiting_bedrooms':
    userState.data.bedrooms = text;
    response = 'Ingrese cantidad de baños:';
    nextStep = 'awaiting_bathrooms';
    break;

  case 'awaiting_bathrooms':
    userState.data.bathrooms = text;
    response = 'Ingrese la superficie en m²:';
    nextStep = 'awaiting_area';
    break;

  case 'awaiting_area':
    userState.data.area = text;
    response = '✅ Datos recibidos. Generando página...';
    nextStep = 'processing';
    break;
}

// Обновляем состояние
workflowStaticData.users[userId].step = nextStep;

return {
  json: {
    userId: userId,
    response: response,
    nextStep: nextStep,
    shouldProcess: nextStep === 'processing',
    userData: userState.data
  }
};
```

## Обработка ошибок

### Error Workflow

Создайте отдельный workflow для обработки ошибок:

**Error Trigger:**
```
Listen for: Workflow Errors
Source Workflow: Casella Property Creator
```

**Error Handler (Function):**
```javascript
const error = $input.item.json.error;
const userId = $input.item.json.execution.data.userId;

let userMessage = '❌ Ocurrió un error. Por favor, intente nuevamente.';

// Логирование в файл
const fs = require('fs');
const logEntry = {
  timestamp: new Date().toISOString(),
  userId: userId,
  error: error.message,
  stack: error.stack
};

fs.appendFileSync(
  '/files/errors.log',
  JSON.stringify(logEntry) + '\n'
);

// Уведомление админа
const adminMessage = `
🚨 ERROR EN WORKFLOW

Usuario: ${userId}
Error: ${error.message}

Stack: ${error.stack}
`;

return [
  {
    json: {
      chatId: userId,
      message: userMessage
    }
  },
  {
    json: {
      chatId: process.env.ADMIN_TELEGRAM_ID,
      message: adminMessage
    }
  }
];
```

## Мониторинг и аналитика

### Webhook для статистики

**Google Sheets интеграция:**

```
Resource: Append
Spreadsheet: Casella Analytics
Sheet: Properties

Values:
  - {{ $now.format('YYYY-MM-DD HH:mm:ss') }}
  - {{ $json.propertyData.category }}
  - {{ $json.propertyData.title }}
  - {{ $json.propertyData.location }}
  - {{ $json.propertyData.price }}
  - {{ $json.fileName }}
  - {{ $json.propertyData.userId }}
```

### Dashboard в N8N

Создайте отдельный workflow для статистики:

**HTTP Webhook (GET /stats):**
```javascript
const workflowStaticData = this.getWorkflowStaticData('global');

const stats = {
  totalProperties: 0,
  byCategory: {},
  byMonth: {},
  activeUsers: Object.keys(workflowStaticData.users || {}).length
};

// Подсчет статистики
// ... логика подсчета ...

return {
  json: {
    status: 'success',
    data: stats
  }
};
```

## Расширенные возможности

### 1. Автопубликация в соцсети

**Instagram API:**
```
HTTP Request:
  Method: POST
  URL: https://graph.facebook.com/v18.0/{{ $env.INSTAGRAM_BUSINESS_ACCOUNT }}/media

Body:
  image_url: {{ $json.photoUrls[0] }}
  caption: {{ $json.socialContent.instagram }}
  access_token: {{ $env.FACEBOOK_ACCESS_TOKEN }}
```

### 2. Email уведомления

**Send Email (SMTP):**
```
To: {{ $json.clientEmail }}
Subject: Nueva Propiedad: {{ $json.propertyData.title }}
Content: HTML

Body:
<!DOCTYPE html>
<html>
<body>
  <h1>{{ $json.propertyData.title }}</h1>
  <img src="{{ $json.photoUrls[0] }}" width="600">
  <p>{{ $json.description }}</p>
  <a href="https://casella.casa/properties/...">Ver Propiedad</a>
</body>
</html>
```

### 3. SMS уведомления (Twilio)

```
HTTP Request:
  Method: POST
  URL: https://api.twilio.com/2010-04-01/Accounts/{{ $env.TWILIO_ACCOUNT_SID }}/Messages.json

Authentication: Basic Auth
  User: {{ $env.TWILIO_ACCOUNT_SID }}
  Password: {{ $env.TWILIO_AUTH_TOKEN }}

Body (Form):
  To: +5492657609278
  From: {{ $env.TWILIO_PHONE_NUMBER }}
  Body: Nueva propiedad publicada: {{ $json.propertyData.title }}
```

### 4. Webhooks для Cloudflare

Триггер деплоя после коммита:

```
HTTP Request:
  Method: POST
  URL: {{ $env.CLOUDFLARE_DEPLOY_HOOK }}
```

## Backup и восстановление

### Автоматический backup workflow

**Cron Trigger:**
```
Mode: Every Day
Hour: 3
Minute: 0
```

**Backup Function:**
```javascript
const workflowStaticData = this.getWorkflowStaticData('global');
const fs = require('fs');

const backupData = {
  timestamp: new Date().toISOString(),
  data: workflowStaticData
};

const backupPath = `/files/backups/backup_${Date.now()}.json`;
fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));

// Upload to Google Drive
return {
  json: {
    backupPath: backupPath,
    fileName: `casella_backup_${new Date().toISOString().split('T')[0]}.json`,
    content: JSON.stringify(backupData)
  }
};
```

**Google Drive Upload:**
```
Resource: File
Operation: Upload
File Name: {{ $json.fileName }}
Content: {{ $json.content }}
Parent Folder: Casella Backups
```

## Переменные окружения

### Настройка в N8N

```bash
# Telegram
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
ADMIN_TELEGRAM_ID=123456789

# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=Cybersyn21/casella.casa

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cloudflare
CLOUDFLARE_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLOUDFLARE_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
CLOUDFLARE_DEPLOY_HOOK=https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/xxxxx

# Database (optional)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=n8n
POSTGRES_USER=n8n
POSTGRES_PASSWORD=secure_password

# SMTP (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=horaciocasella@yahoo.com.ar
SMTP_PASSWORD=app_specific_password
```

## Безопасность

### Best Practices

1. **Аутентификация в N8N:**
   ```bash
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=strong_secure_password_here
   ```

2. **Валидация пользователей:**
   ```javascript
   // Только разрешенные пользователи
   const ALLOWED_USERS = [123456789, 987654321]; // Telegram user IDs

   if (!ALLOWED_USERS.includes($json.message.from.id)) {
     return {
       json: {
         error: true,
         message: 'No autorizado'
       }
     };
   }
   ```

3. **Rate Limiting:**
   ```javascript
   const userId = $json.message.from.id;
   const now = Date.now();
   const rateLimitWindow = 60000; // 1 минута
   const maxRequests = 10;

   const workflowStaticData = this.getWorkflowStaticData('global');
   if (!workflowStaticData.rateLimits) workflowStaticData.rateLimits = {};

   const userRequests = workflowStaticData.rateLimits[userId] || [];
   const recentRequests = userRequests.filter(t => now - t < rateLimitWindow);

   if (recentRequests.length >= maxRequests) {
     return {
       json: {
         error: true,
         message: 'Demasiadas solicitudes. Espere un momento.'
       }
     };
   }

   workflowStaticData.rateLimits[userId] = [...recentRequests, now];
   ```

## Стоимость эксплуатации

### Monthly costs (при self-hosting)

| Сервис | Стоимость | Примечание |
|--------|-----------|------------|
| VPS (Hetzner CX11) | €4.15/мес | 2GB RAM, 20GB SSD |
| OpenAI API | ~$5-10/мес | GPT-4, ~100 описаний |
| Cloudflare Images | $5/мес | До 100k изображений |
| **ИТОГО** | **~$15/мес** | Полная автоматизация |

### Бесплатная альтернатива

- **N8N**: Railway.app free tier ($5 кредит/мес)
- **OpenAI**: Claude 3.5 Haiku через Anthropic ($0.25/1M токенов)
- **Изображения**: Unsplash API (бесплатно)
- **GitHub**: Бесплатно
- **Cloudflare Pages**: Бесплатно

**ИТОГО: ~$0-2/мес** для старта

## Заключение

N8N предоставляет мощную и гибкую платформу для автоматизации создания страниц недвижимости с минимальными затратами и полным контролем над процессом.

### Преимущества решения:

✅ **Визуальный редактор** - легко модифицировать workflow
✅ **Self-hosted** - полный контроль над данными
✅ **Низкая стоимость** - от $0 до $15/мес
✅ **Гибкость** - легко добавлять новые интеграции
✅ **Масштабируемость** - от 10 до 1000+ объектов в месяц

### Следующие шаги:

1. Установите N8N (Docker или Railway)
2. Создайте Telegram бота через @BotFather
3. Импортируйте workflow из этого руководства
4. Настройте credentials (Telegram, GitHub, OpenAI)
5. Протестируйте создание объекта
6. Настройте мониторинг и backup
7. Масштабируйте!

Для технической поддержки и вопросов:
📧 horaciocasella@yahoo.com.ar
📱 WhatsApp: +54 9 2657 609278
