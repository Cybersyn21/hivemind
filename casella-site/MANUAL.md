# Полное руководство | Inmobiliaria Casella & Casella

## Содержание

1. [Обзор проекта](#обзор-проекта)
2. [Структура проекта](#структура-проекта)
3. [Технологии](#технологии)
4. [Установка и настройка](#установка-и-настройка)
5. [Работа с сайтом](#работа-с-сайтом)
6. [Создание страниц недвижимости](#создание-страниц-недвижимости)
7. [Deployment](#deployment)
8. [SEO оптимизация](#seo-оптимизация)
9. [Лучшие практики](#лучшие-практики)
10. [Troubleshooting](#troubleshooting)

---

## Обзор проекта

**Inmobiliaria Casella & Casella** - это профессиональный веб-сайт для агентства недвижимости в Villa Mercedes, San Luis, Argentina.

### Основные характеристики

- 🏠 Каталог недвижимости (продажа, аренда, земля, коммерческая)
- 📱 Полностью адаптивный дизайн (mobile-first)
- 🎨 Современный UI с Tailwind CSS
- ⚡ Статический сайт - быстрая загрузка
- 🔍 SEO-оптимизированный
- 💬 Интеграция с WhatsApp
- 🤖 AI-генерация описаний
- 📊 Аналитика (Google Analytics)

### Контактная информация

- **Владелец**: CASELLA HORACIO
- **Лицензия**: Martillero Público M.P. 1062
- **Телефон**: 2657-609278
- **WhatsApp**: +5492657609278
- **Email**: horaciocasella@yahoo.com.ar
- **Адрес**: Betbeder 46, Villa Mercedes, San Luis

### Статистика компании

- **124+** проданных объектов
- **119+** довольных клиентов
- **10+** лет опыта
- **100%** доверие и прозрачность

---

## Структура проекта

```
casella-site/
├── index.html                 # Главная страница
├── pages/                     # Тематические страницы
│   ├── servicios.html        # Все услуги
│   ├── nosotros.html         # О компании
│   ├── venta.html            # Продажа недвижимости
│   ├── alquiler.html         # Аренда
│   ├── terrenos.html         # Земельные участки
│   ├── comercial.html        # Коммерческая недвижимость
│   ├── tasaciones.html       # Оценка недвижимости
│   └── asesoramiento.html    # Юридические консультации
├── properties/               # Страницы объектов недвижимости
│   ├── venta/               # Продажа
│   │   └── casa-ejemplo.html
│   ├── alquiler/            # Аренда
│   ├── terrenos/            # Земля
│   └── comercial/           # Коммерческая
├── templates/               # Шаблоны
│   └── property-template.html
├── assets/                  # Ресурсы (если используются локальные)
│   ├── images/
│   └── docs/
├── README.md               # Основная документация
├── MANUAL.md              # Это руководство
├── AUTOMATION.md          # Автоматизация
├── DEPLOYMENT.md          # Деплой
├── PROMPTS-GUIDE.md       # AI промпты
└── .gitignore

casella.casa2/              # Vue3 версия (отдельный проект)
├── src/
├── public/
└── package.json
```

### Описание ключевых файлов

#### index.html
Главная страница сайта со всеми основными секциями:
- Hero секция с призывом к действию
- Статистика компании
- Обзор услуг (6 категорий)
- Избранные объекты недвижимости
- О компании
- Контактная форма
- Футер с навигацией

#### pages/servicios.html
Подробное описание всех 6 услуг компании:
1. Продажа недвижимости
2. Аренда
3. Земельные участки
4. Коммерческая недвижимость
5. Оценка
6. Юридические консультации

Каждая услуга имеет:
- Фото из Unsplash
- 2-3 параграфа описания
- Уникальный контент

#### pages/nosotros.html
Страница "О нас" с:
- История компании (5 параграфов)
- Миссия и видение
- Ценности компании
- Обновленная статистика

#### templates/property-template.html
Универсальный шаблон для страниц недвижимости с плейсхолдерами:
```html
{{TITLE}}          - Название объекта
{{PRICE}}          - Цена
{{LOCATION}}       - Местоположение
{{CATEGORY}}       - Категория (venta/alquiler/etc)
{{PHOTOS}}         - Галерея фотографий
{{DESCRIPTION}}    - Описание
{{FEATURES}}       - Характеристики
{{BEDROOMS}}       - Спальни
{{BATHROOMS}}      - Ванные
{{AREA}}           - Площадь
```

---

## Технологии

### Frontend

1. **HTML5**
   - Семантическая разметка
   - Микроданные Schema.org для SEO
   - Open Graph для соцсетей

2. **Tailwind CSS 3.x** (через CDN)
   - Utility-first подход
   - Адаптивный дизайн
   - Кастомная цветовая палитра:
     ```javascript
     primary: "#c29541"    // Золотой
     secondary: "#a07c34"  // Темно-золотой
     emerald: "#25D366"    // WhatsApp зеленый
     ```

3. **JavaScript (Vanilla)**
   - Без зависимостей
   - AOS (Animate On Scroll)
   - Плавная прокрутка
   - Фильтрация объектов
   - Мобильное меню

4. **Font Awesome 6.4**
   - Иконки для интерфейса
   - Социальные сети
   - Характеристики недвижимости

5. **Google Fonts**
   - Inter (основной шрифт)
   - Веса: 300, 400, 500, 600, 700, 800

### CDN зависимости

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<!-- AOS Animation -->
<link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
<script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
```

### Hosting & Deployment

- **Cloudflare Pages** - статический хостинг
  - Преимущества:
    - Бесплатный SSL
    - Глобальный CDN
    - Автоматический деплой из GitHub
    - Неограниченная пропускная способность
    - DDoS защита

### Изображения

- **Unsplash API** - плейсхолдеры
- **Cloudflare Images** - продакшн (рекомендуется)
- Оптимизация: WebP, lazy loading

---

## Установка и настройка

### Предварительные требования

- Git
- Текстовый редактор (VS Code рекомендуется)
- GitHub аккаунт
- Cloudflare аккаунт

### Локальная разработка

1. **Клонирование репозитория**

```bash
git clone https://github.com/Cybersyn21/casella.casa.git
cd casella.casa/casella-site
```

2. **Открытие в браузере**

Просто откройте `index.html` в браузере:
```bash
# Mac
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Или используйте локальный сервер:
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server

# VS Code - установите расширение "Live Server"
```

3. **Редактирование**

Просто редактируйте HTML/CSS/JS файлы в вашем редакторе. Изменения видны сразу после обновления браузера.

### Рекомендуемые расширения VS Code

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",      // Tailwind IntelliSense
    "ritwickdey.liveserver",           // Live Server
    "esbenp.prettier-vscode",          // Prettier
    "formulahendry.auto-rename-tag",   // Auto Rename Tag
    "pranaygp.vscode-css-peek"         // CSS Peek
  ]
}
```

### Настройка Prettier (опционально)

Создайте `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "htmlWhitespaceSensitivity": "ignore"
}
```

---

## Работа с сайтом

### Структура страниц

Каждая HTML-страница следует единой структуре:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Meta теги -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Título | Casella & Casella</title>

    <!-- Tailwind -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: "#c29541",
                        secondary: "#a07c34",
                        emerald: "#25D366"
                    }
                }
            }
        }
    </script>

    <!-- Font Awesome -->
    <link rel="stylesheet" href="...">

    <!-- Google Fonts -->
    <link href="..." rel="stylesheet">

    <!-- Кастомные стили -->
    <style>
        .whatsapp-float { /* ... */ }
    </style>
</head>
<body>
    <!-- Header с навигацией -->
    <header>...</header>

    <!-- Hero секция -->
    <section>...</section>

    <!-- Основной контент -->
    <section>...</section>

    <!-- Footer -->
    <footer>...</footer>

    <!-- WhatsApp кнопка -->
    <a href="https://wa.me/5492657609278">...</a>
</body>
</html>
```

### Навигация

Все страницы имеют единую навигацию:

**Для главной страницы (index.html):**
```html
<nav class="hidden md:flex space-x-6">
    <a href="index.html">Inicio</a>
    <a href="pages/servicios.html">Servicios</a>
    <a href="pages/venta.html">Venta</a>
    <a href="pages/alquiler.html">Alquiler</a>
    <a href="pages/terrenos.html">Terrenos</a>
    <a href="pages/comercial.html">Comercial</a>
    <a href="pages/tasaciones.html">Tasaciones</a>
    <a href="pages/asesoramiento.html">Asesoramiento</a>
    <a href="pages/nosotros.html">Nosotros</a>
</nav>
```

**Для страниц в папке pages/:**
```html
<nav class="hidden md:flex space-x-6">
    <a href="../index.html">Inicio</a>
    <a href="servicios.html">Servicios</a>
    <!-- ... -->
</nav>
```

### WhatsApp интеграция

#### Плавающая кнопка

На каждой странице есть фиксированная кнопка WhatsApp:

```html
<a href="https://wa.me/5492657609278?text=Hola,%20me%20gustaría%20consultar"
   target="_blank"
   class="whatsapp-float">
    <i class="fab fa-whatsapp"></i>
</a>
```

CSS для анимации:
```css
.whatsapp-float {
    position: fixed;
    width: 60px;
    height: 60px;
    bottom: 40px;
    right: 40px;
    background-color: #25D366;
    color: #FFF;
    border-radius: 50px;
    text-align: center;
    font-size: 30px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    animation: pulse 2s infinite;
}

.whatsapp-float:hover {
    background-color: #128C7E;
    transform: scale(1.1);
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
    }
    70% {
        box-shadow: 0 0 0 15px rgba(37, 211, 102, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
    }
}
```

#### Предзаполненные сообщения

Каждая страница использует свой текст:

```javascript
// Главная страница
?text=Hola,%20me%20gustaría%20consultar%20sobre%20una%20propiedad

// Страница продажи
?text=Hola,%20consulto%20sobre%20propiedades%20en%20venta

// Страница аренды
?text=Hola,%20consulto%20sobre%20alquileres%20disponibles

// Оценка
?text=Hola,%20necesito%20solicitar%20una%20tasación

// Юридические консультации
?text=Hola,%20necesito%20asesoramiento%20legal%20inmobiliario
```

### Изображения

#### Unsplash (текущее решение)

Используются качественные стоковые фото:

```html
<!-- Hero изображение -->
<img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Casa">
```

Параметры URL:
- `ixlib=rb-4.0.3` - библиотека
- `auto=format` - автоматический формат (WebP если поддерживается)
- `fit=crop` - обрезка
- `w=800` - ширина 800px
- `q=80` - качество 80%

#### Cloudflare Images (рекомендуется для продакшн)

```html
<!-- Вариант 1: Прямой URL -->
<img src="https://imagedelivery.net/{account_hash}/{image_id}/public" alt="">

<!-- Вариант 2: С вариантами размеров -->
<img src="https://imagedelivery.net/{account_hash}/{image_id}/thumbnail" alt="">
```

Варианты:
- `public` - оригинал
- `thumbnail` - 200x200
- `medium` - 800x600
- `large` - 1920x1080

---

## Создание страниц недвижимости

### Шаг 1: Использование шаблона

Скопируйте `templates/property-template.html`:

```bash
cp templates/property-template.html properties/venta/casa-nueva.html
```

### Шаг 2: Замена плейсхолдеров

Откройте файл и замените:

```html
<!-- Было -->
<title>{{TITLE}} | Casella & Casella</title>

<!-- Стало -->
<title>Casa 3 Dormitorios en Barrio Norte | Casella & Casella</title>
```

Все плейсхолдеры:
- `{{TITLE}}` - название
- `{{CATEGORY}}` - venta/alquiler/terrenos/comercial
- `{{PRICE}}` - цена или "Consultar"
- `{{LOCATION}}` - адрес
- `{{BEDROOMS}}` - количество спален
- `{{BATHROOMS}}` - количество ванных
- `{{AREA}}` - площадь в m²
- `{{DESCRIPTION}}` - полное описание
- `{{PHOTOS}}` - галерея фотографий

### Шаг 3: Галерея фотографий

```html
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Главное фото -->
    <div class="md:col-span-2">
        <img src="URL_ФОТО_1" alt="Casa" class="w-full h-96 object-cover rounded-xl">
    </div>

    <!-- Дополнительные фото -->
    <img src="URL_ФОТО_2" alt="Dormitorio" class="w-full h-64 object-cover rounded-xl">
    <img src="URL_ФОТО_3" alt="Cocina" class="w-full h-64 object-cover rounded-xl">
    <img src="URL_ФОТО_4" alt="Baño" class="w-full h-64 object-cover rounded-xl">
    <img src="URL_ФОТО_5" alt="Patio" class="w-full h-64 object-cover rounded-xl">
</div>
```

### Шаг 4: Характеристики

```html
<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
    <div class="flex items-center p-4 bg-gray-50 rounded-lg">
        <i class="fas fa-bed text-primary text-2xl mr-3"></i>
        <div>
            <p class="text-sm text-gray-600">Dormitorios</p>
            <p class="font-bold">3</p>
        </div>
    </div>

    <div class="flex items-center p-4 bg-gray-50 rounded-lg">
        <i class="fas fa-bath text-primary text-2xl mr-3"></i>
        <div>
            <p class="text-sm text-gray-600">Baños</p>
            <p class="font-bold">2</p>
        </div>
    </div>

    <div class="flex items-center p-4 bg-gray-50 rounded-lg">
        <i class="fas fa-ruler-combined text-primary text-2xl mr-3"></i>
        <div>
            <p class="text-sm text-gray-600">Superficie</p>
            <p class="font-bold">150 m²</p>
        </div>
    </div>

    <!-- Дополнительные характеристики -->
    <div class="flex items-center p-4 bg-gray-50 rounded-lg">
        <i class="fas fa-car text-primary text-2xl mr-3"></i>
        <div>
            <p class="text-sm text-gray-600">Cochera</p>
            <p class="font-bold">Sí</p>
        </div>
    </div>
</div>
```

### Шаг 5: Описание (AI-генерация)

См. `PROMPTS-GUIDE.md` для промптов генерации описаний через ChatGPT/Claude.

Пример структуры описания:

```
Параграф 1: Краткий обзор и главные преимущества
Параграф 2: Детали интерьера и планировка
Параграф 3: Удобства и дополнительные помещения
Параграф 4: Район, местоположение, транспорт
Параграф 5: Призыв к действию и контакты
```

### Шаг 6: Коммит в Git

```bash
git add properties/venta/casa-nueva.html
git commit -m "Add new property: Casa en Barrio Norte"
git push origin main
```

Cloudflare Pages автоматически задеплоит изменения.

---

## Deployment

### Cloudflare Pages

#### Первоначальная настройка

1. **Создание проекта**
   - Зайдите в Cloudflare Dashboard
   - Pages → Create a project
   - Connect to Git → выберите репозиторий

2. **Build настройки**
   ```
   Production branch: main
   Build command: (пусто - статический сайт)
   Build output directory: /
   Root directory: casella-site
   ```

3. **Переменные окружения**
   Не требуются для статического сайта

4. **Custom domain**
   - Pages → Custom domains
   - Добавьте casella.casa
   - Настройте DNS записи

#### Автоматический деплой

Каждый push в `main` ветку автоматически деплоит сайт:

```bash
git add .
git commit -m "Update content"
git push origin main
# Cloudflare автоматически деплоит за 30-60 секунд
```

#### Preview деплои

Создайте ветку для тестирования:

```bash
git checkout -b feature/new-design
# Сделайте изменения
git push origin feature/new-design
```

Cloudflare создаст preview URL:
```
https://feature-new-design.casella-casa.pages.dev
```

### Альтернативные варианты хостинга

#### GitHub Pages

```bash
# В настройках репозитория
Settings → Pages → Source: main branch, folder: /casella-site
```

URL: `https://cybersyn21.github.io/casella.casa/`

#### Netlify

1. Подключите репозиторий
2. Build settings:
   ```
   Base directory: casella-site
   Build command: (пусто)
   Publish directory: ./
   ```

#### Vercel

```bash
npm i -g vercel
cd casella-site
vercel
```

---

## SEO оптимизация

### Meta теги

Каждая страница должна иметь:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Основные meta теги -->
    <title>Casa 3 Dormitorios en Villa Mercedes | Casella & Casella</title>
    <meta name="description" content="Casa de 3 dormitorios en venta en Villa Mercedes. 150m², 2 baños, cochera. Excelente ubicación. Contacte Inmobiliaria Casella & Casella.">
    <meta name="keywords" content="casa venta villa mercedes, inmobiliaria san luis, propiedades villa mercedes, casella casella">

    <!-- Open Graph (Facebook, WhatsApp) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Casa 3 Dormitorios | Casella & Casella">
    <meta property="og:description" content="Casa de 3 dormitorios en venta...">
    <meta property="og:image" content="URL_ГЛАВНОГО_ФОТО">
    <meta property="og:url" content="https://casella.casa/properties/venta/casa-ejemplo.html">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Casa 3 Dormitorios | Casella & Casella">
    <meta name="twitter:description" content="Casa de 3 dormitorios en venta...">
    <meta name="twitter:image" content="URL_ГЛАВНОГО_ФОТО">

    <!-- Geo tags -->
    <meta name="geo.region" content="AR-D">
    <meta name="geo.placename" content="Villa Mercedes, San Luis">
    <meta name="geo.position" content="-33.678435;-65.463164">
</head>
```

### Schema.org разметка

Добавьте JSON-LD для лучшей индексации:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Inmobiliaria Casella & Casella",
  "image": "https://casella.casa/logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Betbeder 46",
    "addressLocality": "Villa Mercedes",
    "addressRegion": "San Luis",
    "postalCode": "5730",
    "addressCountry": "AR"
  },
  "telephone": "+5492657609278",
  "email": "horaciocasella@yahoo.com.ar",
  "priceRange": "$$",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "21:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "13:00"
    }
  ]
}
</script>
```

Для страниц объектов:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SingleFamilyResidence",
  "name": "Casa 3 Dormitorios en Barrio Norte",
  "description": "Casa de 3 dormitorios...",
  "image": ["URL_ФОТО_1", "URL_ФОТО_2"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Calle Ejemplo 123",
    "addressLocality": "Villa Mercedes",
    "addressRegion": "San Luis",
    "addressCountry": "AR"
  },
  "numberOfRooms": 3,
  "numberOfBathroomsTotal": 2,
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": "150",
    "unitCode": "MTK"
  },
  "offers": {
    "@type": "Offer",
    "price": "Consultar",
    "priceCurrency": "ARS",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### Google Analytics

Добавьте перед `</head>`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Sitemap.xml

Создайте `sitemap.xml` в корне:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://casella.casa/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://casella.casa/pages/servicios.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... остальные страницы ... -->
</urlset>
```

### robots.txt

Создайте `robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://casella.casa/sitemap.xml
```

---

## Лучшие практики

### Производительность

1. **Оптимизация изображений**
   - Используйте WebP формат
   - Lazy loading: `loading="lazy"`
   - Responsive images: `srcset`
   - Максимальная ширина: 1920px
   - Качество: 80-85%

2. **CSS**
   - Используйте только необходимые Tailwind классы
   - Минимизируйте кастомный CSS
   - Используйте CSS-переменные для цветов

3. **JavaScript**
   - Минимизируйте JS
   - Используйте `defer` для скриптов
   - Избегайте jQuery (не нужен)

### Доступность (a11y)

1. **Альтернативный текст**
   ```html
   <img src="casa.jpg" alt="Casa de 3 dormitorios con jardín">
   ```

2. **Контрастность**
   - Минимум 4.5:1 для текста
   - Проверка: WebAIM Contrast Checker

3. **Навигация с клавиатуры**
   - Все интерактивные элементы доступны через Tab
   - Видимый focus indicator

4. **ARIA метки**
   ```html
   <button aria-label="Abrir menú de navegación">
       <i class="fas fa-bars"></i>
   </button>
   ```

### Безопасность

1. **Ссылки**
   ```html
   <!-- Внешние ссылки -->
   <a href="https://external.com" target="_blank" rel="noopener noreferrer">
   ```

2. **Формы**
   - Валидация на клиенте И сервере
   - CAPTCHA для предотвращения спама
   - Санитизация данных

### Мобильная оптимизация

1. **Mobile-first дизайн**
   ```html
   <!-- Базовый стиль для мобильных, затем десктоп -->
   <div class="text-sm md:text-base lg:text-lg">
   ```

2. **Touch-friendly элементы**
   - Минимальный размер кнопок: 44x44px
   - Достаточные отступы между элементами

3. **Тестирование**
   - Chrome DevTools (Device Mode)
   - Реальные устройства
   - BrowserStack для кросс-браузерности

---

## Troubleshooting

### Проблема: Изображения не загружаются

**Решение 1**: Проверьте URL
```html
<!-- Плохо -->
<img src="images/casa.jpg">

<!-- Хорошо - абсолютный путь -->
<img src="https://casella.casa/assets/images/casa.jpg">

<!-- Или используйте Unsplash -->
<img src="https://images.unsplash.com/photo-xxx">
```

**Решение 2**: CORS проблемы
- Используйте Cloudflare Images
- Или добавьте изображения в репозиторий

### Проблема: Навигация не работает на вложенных страницах

**Решение**: Проверьте относительные пути

```html
<!-- В pages/servicios.html -->
<a href="../index.html">Inicio</a>  <!-- Правильно -->
<a href="index.html">Inicio</a>      <!-- Неправильно -->
```

### Проблема: Tailwind стили не применяются

**Решение**: Проверьте CDN подключение

```html
<!-- Должно быть в <head> -->
<script src="https://cdn.tailwindcss.com"></script>
<script>
    tailwind.config = {
        theme: {
            extend: {
                colors: {
                    primary: "#c29541",
                    secondary: "#a07c34"
                }
            }
        }
    }
</script>
```

### Проблема: WhatsApp кнопка перекрывает контент

**Решение**: Добавьте padding в footer

```html
<footer class="pb-24">  <!-- 24 = 96px отступ снизу -->
    ...
</footer>
```

### Проблема: Медленная загрузка

**Решения**:
1. Оптимизируйте изображения (TinyPNG)
2. Используйте CDN
3. Включите кеширование в Cloudflare
4. Минифицируйте HTML

### Проблема: Формы не отправляются

**Решение**: Используйте Formspree или аналог

```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
    <input type="email" name="email">
    <input type="text" name="message">
    <button type="submit">Enviar</button>
</form>
```

---

## Контрольный чеклист перед деплоем

### Контент
- [ ] Все тексты на испанском
- [ ] Корректные контактные данные
- [ ] Актуальные фотографии
- [ ] Проверка орфографии

### SEO
- [ ] Meta теги на всех страницах
- [ ] Open Graph теги
- [ ] Schema.org разметка
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] Google Analytics

### Функциональность
- [ ] Все ссылки работают
- [ ] Формы отправляются
- [ ] WhatsApp кнопка работает
- [ ] Мобильное меню открывается
- [ ] Фильтры объектов работают

### Производительность
- [ ] Изображения оптимизированы
- [ ] Lazy loading включен
- [ ] Lighthouse score > 90

### Безопасность
- [ ] HTTPS включен
- [ ] rel="noopener" на внешних ссылках
- [ ] Нет секретов в коде

### Кросс-браузерность
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Мобильные браузеры

---

## Полезные ресурсы

### Документация
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Font Awesome](https://fontawesome.com/icons)
- [AOS Animation](https://michalsnik.github.io/aos/)

### Инструменты
- [TinyPNG](https://tinypng.com/) - оптимизация изображений
- [Unsplash](https://unsplash.com/) - бесплатные фото
- [Coolors](https://coolors.co/) - цветовые палитры
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### AI для контента
- ChatGPT (описания недвижимости)
- Claude (SEO тексты)
- DALL-E / Midjourney (генерация изображений)

### Поддержка
- GitHub Issues
- Email: horaciocasella@yahoo.com.ar
- WhatsApp: +5492657609278

---

**Версия документа**: 1.0
**Дата обновления**: 2025-01-15
**Автор**: Inmobiliaria Casella & Casella Development Team
