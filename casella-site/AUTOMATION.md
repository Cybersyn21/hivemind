# Руководство по автоматизации | Inmobiliaria Casella & Casella

## Обзор

Этот документ описывает систему автоматизации для создания страниц недвижимости и публикации контента в социальных сетях для сайта Inmobiliaria Casella & Casella.

## Архитектура системы

### Компоненты

1. **Telegram Bot** - основной интерфейс для загрузки фотографий и данных о недвижимости
2. **Backend API** - обработка данных и генерация HTML-страниц
3. **Cloudflare Pages** - автоматический деплой при push в репозиторий
4. **AI Integration** - генерация описаний через ChatGPT/Claude API

## Telegram Bot для загрузки фотографий

### Функциональность

Бот позволяет:
- Загружать фотографии недвижимости (до 10 фото на объект)
- Вводить основные данные о недвижимости через интерактивную форму
- Автоматически генерировать HTML-страницу объекта
- Создавать контент для социальных сетей
- Коммитить и пушить изменения в GitHub

### Workflow загрузки

```
1. Пользователь отправляет команду /new_property
2. Бот запрашивает категорию (venta/alquiler/terrenos/comercial)
3. Пользователь загружает фотографии (drag & drop в Telegram)
4. Бот запрашивает основные данные:
   - Название объекта
   - Цена (или "Consultar")
   - Местоположение
   - Количество комнат (если применимо)
   - Количество ванных (если применимо)
   - Площадь
   - Дополнительные характеристики
5. Бот генерирует:
   - Slug для URL (например: casa-barrio-norte-001)
   - HTML-страницу на основе шаблона
   - Описание через AI
   - Посты для соцсетей
6. Бот создает commit и push в репозиторий
7. Cloudflare Pages автоматически деплоит изменения
```

### Пример кода Telegram Bot (Python)

```python
import telebot
from telebot import types
import requests
import os
from datetime import datetime
from github import Github

bot = telebot.TeleBot(os.getenv('TELEGRAM_BOT_TOKEN'))
github_client = Github(os.getenv('GITHUB_TOKEN'))

# Хранилище временных данных пользователя
user_data = {}

@bot.message_handler(commands=['start'])
def start(message):
    bot.reply_to(message,
        "Bienvenido al bot de Inmobiliaria Casella & Casella!\n\n"
        "Comandos disponibles:\n"
        "/new_property - Agregar nueva propiedad\n"
        "/help - Ayuda")

@bot.message_handler(commands=['new_property'])
def new_property(message):
    user_id = message.from_user.id
    user_data[user_id] = {
        'photos': [],
        'step': 'category'
    }

    markup = types.ReplyKeyboardMarkup(row_width=2, one_time_keyboard=True)
    markup.add(
        types.KeyboardButton('Venta'),
        types.KeyboardButton('Alquiler'),
        types.KeyboardButton('Terrenos'),
        types.KeyboardButton('Comercial')
    )

    bot.send_message(message.chat.id,
        "Seleccione la categoría de propiedad:",
        reply_markup=markup)

@bot.message_handler(content_types=['photo'])
def handle_photos(message):
    user_id = message.from_user.id

    if user_id not in user_data:
        bot.reply_to(message, "Por favor, inicie con /new_property")
        return

    # Скачиваем фото
    file_info = bot.get_file(message.photo[-1].file_id)
    downloaded_file = bot.download_file(file_info.file_path)

    # Сохраняем локально
    filename = f"temp_{user_id}_{len(user_data[user_id]['photos'])}.jpg"
    with open(filename, 'wb') as f:
        f.write(downloaded_file)

    user_data[user_id]['photos'].append(filename)

    bot.reply_to(message,
        f"Foto {len(user_data[user_id]['photos'])} recibida. "
        "Envíe más fotos o /done para continuar")

@bot.message_handler(commands=['done'])
def done_photos(message):
    user_id = message.from_user.id

    if user_id not in user_data or len(user_data[user_id]['photos']) == 0:
        bot.reply_to(message, "No hay fotos cargadas")
        return

    user_data[user_id]['step'] = 'title'
    bot.send_message(message.chat.id,
        "Ingrese el título de la propiedad:")

@bot.message_handler(func=lambda message: True)
def handle_text(message):
    user_id = message.from_user.id

    if user_id not in user_data:
        return

    step = user_data[user_id].get('step')

    if step == 'category':
        user_data[user_id]['category'] = message.text.lower()
        user_data[user_id]['step'] = 'photos'
        bot.send_message(message.chat.id,
            "Envíe las fotos de la propiedad. "
            "Cuando termine, use /done")

    elif step == 'title':
        user_data[user_id]['title'] = message.text
        user_data[user_id]['step'] = 'price'
        bot.send_message(message.chat.id,
            "Ingrese el precio (o 'Consultar'):")

    elif step == 'price':
        user_data[user_id]['price'] = message.text
        user_data[user_id]['step'] = 'location'
        bot.send_message(message.chat.id,
            "Ingrese la ubicación:")

    elif step == 'location':
        user_data[user_id]['location'] = message.text
        # Генерируем страницу и пушим в GitHub
        generate_and_push(user_id)

def generate_and_push(user_id):
    data = user_data[user_id]

    # 1. Загружаем фото в Unsplash или используем локальное хранилище
    # 2. Генерируем slug
    slug = generate_slug(data['title'])

    # 3. Генерируем HTML из шаблона
    html_content = generate_html_page(data, slug)

    # 4. Коммитим в GitHub
    repo = github_client.get_repo("Cybersyn21/casella.casa")

    file_path = f"properties/{data['category']}/{slug}.html"
    repo.create_file(
        file_path,
        f"Add property: {data['title']}",
        html_content,
        branch="main"
    )

    # 5. Генерируем посты для соцсетей
    social_content = generate_social_posts(data)

    bot.send_message(user_id,
        f"✅ Propiedad publicada!\n\n"
        f"URL: https://casella.casa/{file_path}\n\n"
        f"Contenido para redes sociales:\n{social_content}")

    # Очищаем данные
    cleanup_user_data(user_id)

def generate_slug(title):
    """Генерирует URL-friendly slug"""
    import re
    slug = title.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug

def generate_html_page(data, slug):
    """Генерирует HTML-страницу из шаблона"""
    template = open('templates/property-template.html', 'r').read()

    # Замена плейсхолдеров
    html = template.replace('{{TITLE}}', data['title'])
    html = html.replace('{{PRICE}}', data['price'])
    html = html.replace('{{LOCATION}}', data['location'])
    html = html.replace('{{CATEGORY}}', data['category'])

    # Генерируем галерею фотографий
    photos_html = generate_photos_html(data['photos'])
    html = html.replace('{{PHOTOS}}', photos_html)

    # Генерируем описание через AI
    description = generate_ai_description(data)
    html = html.replace('{{DESCRIPTION}}', description)

    return html

def generate_ai_description(data):
    """Генерирует описание через OpenAI API"""
    import openai

    openai.api_key = os.getenv('OPENAI_API_KEY')

    prompt = f"""
    Crea una descripción atractiva y profesional en español para esta propiedad:

    Título: {data['title']}
    Categoría: {data['category']}
    Ubicación: {data['location']}
    Precio: {data['price']}

    La descripción debe tener 3-4 párrafos, destacar características clave,
    ubicación, y motivar al cliente a contactar.
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Eres un experto en marketing inmobiliario en Argentina."},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content

def generate_social_posts(data):
    """Генерирует посты для соцсетей"""
    # WhatsApp
    whatsapp = f"""
🏠 *{data['title']}*
📍 {data['location']}
💰 {data['price']}

¡Excelente oportunidad!
Más info: https://casella.casa/...

📞 2657-609278
    """.strip()

    # Instagram
    instagram = f"""
🏠 {data['title']}
📍 {data['location']}
💰 {data['price']}

¡Tu próxima casa te está esperando!

#InmobiliariaCasella #VillaMercedes #SanLuis #Inmobiliaria #CasaEnVenta
    """.strip()

    # Facebook
    facebook = f"""
🏠 Nueva Propiedad Disponible!

{data['title']}
📍 Ubicación: {data['location']}
💰 Precio: {data['price']}

Contactanos para más información:
📞 2657-609278
📧 horaciocasella@yahoo.com.ar

#InmobiliariaCasella
    """.strip()

    return f"""
📱 WHATSAPP:
{whatsapp}

📷 INSTAGRAM:
{instagram}

📘 FACEBOOK:
{facebook}
"""

if __name__ == '__main__':
    bot.polling(none_stop=True)
```

## Интеграция с GitHub Actions

### Автоматический деплой

Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
    paths:
      - 'properties/**'
      - 'pages/**'
      - 'index.html'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Publish to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: casella-casa
          directory: ./
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

## Хранение изображений

### Варианты

1. **GitHub Repository** (текущий вариант)
   - Преимущества: бесплатно, версионирование
   - Недостатки: ограничение размера репозитория

2. **Cloudflare Images**
   - Преимущества: CDN, оптимизация, варианты размеров
   - Стоимость: $5/месяц за 100,000 изображений

3. **Unsplash API** (для плейсхолдеров)
   - Используется для демо-страниц
   - Бесплатно для некоммерческого использования

### Рекомендация

Для продакшн-версии рекомендуется использовать **Cloudflare Images**:

```javascript
// Загрузка в Cloudflare Images через API
async function uploadToCloudflare(imageBuffer, filename) {
  const formData = new FormData();
  formData.append('file', imageBuffer, filename);

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`
      },
      body: formData
    }
  );

  const result = await response.json();
  return result.result.variants[0]; // URL изображения
}
```

## AI-генерация контента

### Промпты для генерации описаний

```python
PROPERTY_DESCRIPTION_PROMPT = """
Eres un experto en marketing inmobiliario en Argentina, específicamente en Villa Mercedes, San Luis.

Crea una descripción profesional y atractiva en español argentino para esta propiedad:

Categoría: {category}
Título: {title}
Ubicación: {location}
Precio: {price}
Características: {features}

Requisitos:
1. 3-4 párrafos bien estructurados
2. Destacar ubicación y características únicas
3. Usar lenguaje persuasivo pero profesional
4. Incluir llamado a la acción al final
5. Mencionar servicios de la inmobiliaria Casella & Casella
6. Usar términos comunes en Argentina (departamento, cochera, expensas, etc.)

La descripción debe ser convincente y hacer que el cliente quiera contactar inmediatamente.
"""

SOCIAL_MEDIA_PROMPT = """
Crea contenido para redes sociales para esta propiedad:

{property_details}

Genera 3 versiones:
1. WhatsApp (conciso, con emojis, máx 200 caracteres)
2. Instagram (atractivo, con hashtags relevantes)
3. Facebook (más detallado, profesional)

Incluye siempre:
- Datos de contacto: 2657-609278
- Email: horaciocasella@yahoo.com.ar
- Emojis apropiados
- Hashtags relevantes para San Luis, Argentina
"""
```

## Automatización con Make.com (alternativa)

Como альтернатива кастомному боту, можно использовать no-code платформу Make.com:

### Workflow Make.com

```
1. Telegram Trigger (новое сообщение/фото)
   ↓
2. Router по типу контента
   ↓
3a. Если фото → сохранить в Google Drive/Cloudflare
3b. Если текст → парсить данные
   ↓
4. Aggregator (собрать все фото)
   ↓
5. OpenAI Module (генерация описания)
   ↓
6. Google Docs/Template (генерация HTML)
   ↓
7. GitHub Module (создать файл и commit)
   ↓
8. Cloudflare Pages Webhook (деплой)
   ↓
9. Telegram Bot (отправить подтверждение)
```

### Преимущества Make.com
- Не нужно писать код
- Визуальный интерфейс
- Готовые интеграции
- Легко масштабировать

### Недостатки
- Стоимость: ~$9/месяц
- Ограничения free tier

## Мониторинг и логирование

### Telegram уведомления

```python
def send_notification(message, level='info'):
    """Отправка уведомлений админу в Telegram"""
    emoji = {
        'info': 'ℹ️',
        'success': '✅',
        'warning': '⚠️',
        'error': '❌'
    }

    bot.send_message(
        ADMIN_CHAT_ID,
        f"{emoji[level]} {message}"
    )

# Использование
try:
    generate_and_push(user_id)
    send_notification("Nueva propiedad publicada exitosamente", 'success')
except Exception as e:
    send_notification(f"Error al publicar propiedad: {str(e)}", 'error')
```

### Логирование в файл

```python
import logging

logging.basicConfig(
    filename='bot.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

logger.info(f"Property created: {slug}")
logger.error(f"Failed to upload photo: {e}")
```

## Резервное копирование

### Автоматический backup в Google Drive

```python
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

def backup_to_drive():
    """Резервное копирование всех HTML-файлов"""
    gauth = GoogleAuth()
    gauth.LocalWebserverAuth()
    drive = GoogleDrive(gauth)

    # Создаем архив
    import shutil
    shutil.make_archive('backup', 'zip', 'properties/')

    # Загружаем в Drive
    file = drive.CreateFile({
        'title': f'casella-backup-{datetime.now().strftime("%Y%m%d")}.zip'
    })
    file.SetContentFile('backup.zip')
    file.Upload()
```

## Переменные окружения

Создайте файл `.env`:

```bash
# Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
ADMIN_CHAT_ID=your_admin_telegram_id

# GitHub
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPO=Cybersyn21/casella.casa

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Cloudflare
CLOUDFLARE_API_TOKEN=your_cloudflare_token
CLOUDFLARE_ACCOUNT_ID=your_account_id

# Google Drive (опционально)
GOOGLE_DRIVE_CLIENT_ID=your_client_id
GOOGLE_DRIVE_CLIENT_SECRET=your_client_secret
```

## Deployment бота

### Варианты хостинга

1. **Heroku** (рекомендуется для начала)
   ```bash
   heroku create casella-bot
   heroku config:set TELEGRAM_BOT_TOKEN=xxx
   git push heroku main
   ```

2. **Railway.app** (современная альтернатива)
   - Подключить GitHub репозиторий
   - Автоматический деплой при push

3. **VPS** (DigitalOcean, Linode)
   ```bash
   # На сервере
   git clone https://github.com/your-repo/casella-bot
   cd casella-bot
   pip install -r requirements.txt
   python bot.py

   # Запуск через systemd для постоянной работы
   sudo systemctl enable casella-bot
   sudo systemctl start casella-bot
   ```

## Заключение

Эта система автоматизации позволяет:
- ✅ Быстро добавлять новые объекты недвижимости
- ✅ Автоматически генерировать профессиональные описания
- ✅ Создавать контент для всех социальных сетей
- ✅ Автоматически деплоить изменения
- ✅ Экономить время на рутинных задачах

Следующие шаги:
1. Создать Telegram бота через @BotFather
2. Настроить GitHub Personal Access Token
3. Получить API ключи для OpenAI и Cloudflare
4. Задеплоить бота на выбранный хостинг
5. Протестировать весь workflow

Для вопросов и поддержки обращайтесь к разработчику.
