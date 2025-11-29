# Структура проекта | Inmobiliaria Casella & Casella

## Обзор файловой системы

Этот документ объясняет, как организована файловая структура проекта сайта для Inmobiliaria Casella & Casella.

## 🗂️ Полная структура проекта

```
casella-site/                           # 📁 Корневая папка проекта
│
├── index.html                          # 🏠 Главная страница сайта
│
├── pages/                              # 📄 Папка тематических страниц
│   ├── servicios.html                 # Обзор всех услуг
│   ├── nosotros.html                  # О компании
│   ├── venta.html                     # Продажа недвижимости
│   ├── alquiler.html                  # Аренда
│   ├── terrenos.html                  # Земельные участки
│   ├── comercial.html                 # Коммерческая недвижимость
│   ├── tasaciones.html                # Оценка недвижимости
│   └── asesoramiento.html             # Юридические консультации
│
├── properties/                         # 🏘️ Папка объектов недвижимости
│   ├── venta/                         # Объекты на продажу
│   │   ├── casa-barrio-norte-001.html
│   │   ├── casa-centro-002.html
│   │   └── departamento-sur-003.html
│   │
│   ├── alquiler/                      # Объекты в аренду
│   │   ├── depto-centro-001.html
│   │   └── casa-oeste-002.html
│   │
│   ├── terrenos/                      # Земельные участки
│   │   ├── lote-norte-001.html
│   │   └── terreno-rural-002.html
│   │
│   └── comercial/                     # Коммерческая недвижимость
│       ├── local-centro-001.html
│       └── oficina-microcentro-002.html
│
├── templates/                          # 📋 Шаблоны для создания страниц
│   ├── property-template.html         # Универсальный шаблон объекта
│   └── listing-template.html          # Шаблон листинга (будущее)
│
├── assets/                             # 🎨 Ресурсы (опционально)
│   ├── images/                        # Локальные изображения
│   │   ├── logo.png
│   │   └── favicon.ico
│   │
│   ├── css/                           # CSS файлы (если нужны)
│   │   └── custom.css
│   │
│   └── js/                            # JavaScript файлы (если нужны)
│       └── custom.js
│
├── docs/                               # 📚 Документация
│   ├── README.md                      # Основная документация (на русском)
│   ├── MANUAL.md                      # Полное руководство
│   ├── AUTOMATION.md                  # Автоматизация (Telegram bot)
│   ├── AUTOMATION2.md                 # Автоматизация (N8N)
│   ├── STRUCTURE.md                   # Этот файл
│   ├── DEPLOYMENT.md                  # Инструкции по деплою
│   └── PROMPTS-GUIDE.md               # AI промпты
│
├── .gitignore                          # Git ignore файл
├── sitemap.xml                         # Карта сайта для SEO
├── robots.txt                          # Правила для поисковых ботов
└── README.md                           # Краткая документация

# Альтернативная структура (Vue3 версия)
casella.casa2/                          # 📁 Vue3 SPA версия
├── src/
│   ├── components/
│   ├── views/
│   └── router/
├── public/
└── package.json
```

## 📍 Принципы организации

### 1. Разделение по типу контента

#### ✅ **Используем папки** для организации контента

**Почему?**
- Легче найти нужный файл
- Понятная структура для разработчиков
- Удобно масштабировать (100+ объектов)
- Упрощает автоматизацию

**Пример:**
```
✅ ПРАВИЛЬНО:
properties/venta/casa-barrio-norte-001.html
properties/alquiler/depto-centro-001.html

❌ НЕПРАВИЛЬНО:
casa-barrio-norte-001-venta.html
depto-centro-001-alquiler.html
```

#### ❌ **НЕ грузим** все в корень

**Плохая практика:**
```
casella-site/
├── index.html
├── servicios.html
├── venta.html
├── casa-1.html
├── casa-2.html
├── depto-1.html
├── terreno-1.html
├── ... (100+ файлов)
```

**Проблемы:**
- Хаос и беспорядок
- Сложно найти файлы
- Невозможно масштабировать
- Нет логической группировки

## 🏗️ Детальное описание структуры

### 📁 Корневая папка (casella-site/)

**Что здесь:**
- `index.html` - ТОЛЬКО главная страница
- `sitemap.xml` - карта сайта
- `robots.txt` - правила для ботов
- `.gitignore` - игнорируемые файлы

**Что НЕ должно быть здесь:**
- ❌ Другие HTML страницы
- ❌ Изображения объектов
- ❌ Вспомогательные файлы

### 📄 Папка pages/

**Назначение:** Тематические страницы сайта

**Содержимое:**
```
pages/
├── servicios.html        # Все услуги компании
├── nosotros.html         # О компании
├── venta.html            # Информация о продаже
├── alquiler.html         # Информация об аренде
├── terrenos.html         # Информация о земельных участках
├── comercial.html        # Коммерческая недвижимость
├── tasaciones.html       # Оценка недвижимости
└── asesoramiento.html    # Юридические консультации
```

**Правила:**
- ✅ Только тематические страницы
- ✅ По одной странице на каждую услугу/раздел
- ❌ Не кладем сюда объекты недвижимости

**Ссылки на эти страницы:**

Из корня (index.html):
```html
<a href="pages/servicios.html">Servicios</a>
<a href="pages/venta.html">Venta</a>
```

Из самих страниц (pages/servicios.html):
```html
<a href="../index.html">Inicio</a>
<a href="venta.html">Venta</a>
```

### 🏘️ Папка properties/

**Назначение:** Все объекты недвижимости

**Структура по категориям:**

```
properties/
│
├── venta/              # Продажа
│   ├── casa-barrio-norte-001.html
│   ├── casa-centro-002.html
│   ├── departamento-sur-003.html
│   └── ... (все объекты на продажу)
│
├── alquiler/           # Аренда
│   ├── depto-centro-001.html
│   ├── casa-oeste-002.html
│   └── ... (все объекты в аренду)
│
├── terrenos/           # Земля
│   ├── lote-norte-001.html
│   ├── terreno-rural-002.html
│   └── ... (все земельные участки)
│
└── comercial/          # Коммерческая
    ├── local-centro-001.html
    ├── oficina-microcentro-002.html
    └── ... (все коммерческие объекты)
```

**Правила именования файлов:**

Формат: `[тип]-[местоположение]-[номер].html`

Примеры:
```
✅ ПРАВИЛЬНО:
casa-barrio-norte-001.html
departamento-centro-002.html
terreno-zona-rural-003.html
local-comercial-microcentro-004.html

❌ НЕПРАВИЛЬНО:
Casa Barrio Norte.html           (пробелы, заглавные)
casa_barrio_norte_001.html       (подчеркивания вместо дефисов)
001.html                         (неинформативное имя)
casa.html                        (слишком общее)
```

**Ссылки на объекты:**

Из главной страницы (index.html):
```html
<a href="properties/venta/casa-barrio-norte-001.html">Ver Propiedad</a>
```

Из тематических страниц (pages/venta.html):
```html
<a href="../properties/venta/casa-barrio-norte-001.html">Ver Casa</a>
```

Из самих объектов (properties/venta/casa-barrio-norte-001.html):
```html
<a href="../../index.html">Inicio</a>
<a href="../../pages/venta.html">Venta</a>
```

### 📋 Папка templates/

**Назначение:** Шаблоны для создания новых страниц

**Содержимое:**
```
templates/
├── property-template.html    # Основной шаблон объекта
└── listing-template.html     # Шаблон листинга (будущее)
```

**Использование:**

1. Копируем шаблон:
```bash
cp templates/property-template.html properties/venta/nueva-casa.html
```

2. Заменяем плейсхолдеры:
```html
{{TITLE}}        → Casa 3 Dormitorios
{{PRICE}}        → $120,000
{{LOCATION}}     → Barrio Norte
{{CATEGORY}}     → venta
{{PHOTOS}}       → [HTML галереи]
{{DESCRIPTION}}  → [Полное описание]
```

3. Сохраняем и коммитим

### 🎨 Папка assets/ (опционально)

**Назначение:** Статические ресурсы

**Когда использовать:**
- Логотип компании
- Favicon
- Кастомные CSS/JS файлы
- Общие изображения (не объектов)

**Структура:**
```
assets/
├── images/
│   ├── logo.png              # Логотип компании
│   ├── logo-white.png        # Белый логотип
│   ├── favicon.ico           # Фавикон
│   └── placeholder.jpg       # Заглушка
│
├── css/
│   └── custom.css           # Дополнительные стили
│
└── js/
    └── custom.js            # Дополнительные скрипты
```

**Когда НЕ использовать:**
- ❌ Фотографии объектов недвижимости
  (используем Cloudflare Images или Unsplash)
- ❌ Большие медиа файлы
  (используем CDN)

### 📚 Папка docs/

**Назначение:** Вся документация проекта

**Содержимое:**
```
docs/
├── README.md              # Основная документация
├── MANUAL.md              # Полное руководство
├── AUTOMATION.md          # Telegram бот
├── AUTOMATION2.md         # N8N автоматизация
├── STRUCTURE.md           # Этот файл
├── DEPLOYMENT.md          # Деплой
└── PROMPTS-GUIDE.md       # AI промпты
```

**Язык документации:**
- 📄 Русский язык для всех .md файлов
- 🌐 Испанский язык для HTML контента

## 🔗 Система ссылок (linking)

### Относительные пути

**Важно понимать:**

```
casella-site/
├── index.html                    # Уровень 0
├── pages/
│   └── servicios.html           # Уровень 1
└── properties/
    └── venta/
        └── casa-001.html        # Уровень 2
```

### Из index.html (корень)

```html
<!-- На тематические страницы -->
<a href="pages/servicios.html">Servicios</a>
<a href="pages/venta.html">Venta</a>

<!-- На объекты -->
<a href="properties/venta/casa-001.html">Ver Casa</a>
```

### Из pages/servicios.html

```html
<!-- Назад на главную -->
<a href="../index.html">Inicio</a>

<!-- На другие тематические страницы -->
<a href="venta.html">Venta</a>
<a href="alquiler.html">Alquiler</a>

<!-- На объекты -->
<a href="../properties/venta/casa-001.html">Ver Casa</a>
```

### Из properties/venta/casa-001.html

```html
<!-- Назад на главную -->
<a href="../../index.html">Inicio</a>

<!-- На тематические страницы -->
<a href="../../pages/venta.html">Venta</a>
<a href="../../pages/servicios.html">Servicios</a>

<!-- На другие объекты в той же категории -->
<a href="casa-002.html">Siguiente Propiedad</a>

<!-- На объекты в другой категории -->
<a href="../alquiler/depto-001.html">Ver Alquileres</a>
```

### Навигационное меню (одинаковое на всех страницах)

**В index.html:**
```html
<nav>
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

**В pages/*.html:**
```html
<nav>
    <a href="../index.html">Inicio</a>
    <a href="servicios.html">Servicios</a>
    <a href="venta.html">Venta</a>
    <a href="alquiler.html">Alquiler</a>
    <a href="terrenos.html">Terrenos</a>
    <a href="comercial.html">Comercial</a>
    <a href="tasaciones.html">Tasaciones</a>
    <a href="asesoramiento.html">Asesoramiento</a>
    <a href="nosotros.html">Nosotros</a>
</nav>
```

**В properties/[категория]/*.html:**
```html
<nav>
    <a href="../../index.html">Inicio</a>
    <a href="../../pages/servicios.html">Servicios</a>
    <a href="../../pages/venta.html">Venta</a>
    <a href="../../pages/alquiler.html">Alquiler</a>
    <a href="../../pages/terrenos.html">Terrenos</a>
    <a href="../../pages/comercial.html">Comercial</a>
    <a href="../../pages/tasaciones.html">Tasaciones</a>
    <a href="../../pages/asesoramiento.html">Asesoramiento</a>
    <a href="../../pages/nosotros.html">Nosotros</a>
</nav>
```

## 📊 Примеры структуры для разных сценариев

### Сценарий 1: Небольшой проект (до 20 объектов)

```
casella-site/
├── index.html
├── pages/
│   ├── servicios.html
│   └── nosotros.html
└── properties/
    ├── venta/
    │   ├── casa-001.html
    │   └── casa-002.html
    └── alquiler/
        └── depto-001.html
```

**Простая структура, легко управлять вручную**

### Сценарий 2: Средний проект (20-100 объектов)

```
casella-site/
├── index.html
├── pages/
│   ├── servicios.html
│   ├── venta.html
│   ├── alquiler.html
│   └── nosotros.html
├── properties/
│   ├── venta/
│   │   ├── casas/
│   │   │   ├── casa-001.html
│   │   │   └── casa-002.html
│   │   └── departamentos/
│   │       ├── depto-001.html
│   │       └── depto-002.html
│   └── alquiler/
│       └── ... (аналогично)
└── templates/
    └── property-template.html
```

**Дополнительная категоризация по типу недвижимости**

### Сценарий 3: Большой проект (100+ объектов)

```
casella-site/
├── index.html
├── pages/
│   └── ... (все тематические)
├── properties/
│   ├── venta/
│   │   ├── 2024/
│   │   │   ├── 01-enero/
│   │   │   ├── 02-febrero/
│   │   │   └── ... (по месяцам)
│   │   └── 2025/
│   │       └── ... (по месяцам)
│   └── ... (другие категории)
└── api/
    └── properties.json       # JSON API для динамической загрузки
```

**Группировка по годам и месяцам + JSON API**

## 🚀 Workflow создания нового объекта

### Ручной процесс

1. **Скопировать шаблон:**
```bash
cp templates/property-template.html properties/venta/casa-nueva.html
```

2. **Заменить плейсхолдеры:**
- Открыть в редакторе
- Find & Replace для {{TITLE}}, {{PRICE}}, и т.д.
- Сохранить

3. **Добавить фотографии:**
- Загрузить в Cloudflare Images
- Вставить URL в галерею

4. **Коммит в Git:**
```bash
git add properties/venta/casa-nueva.html
git commit -m "Add new property: Casa Nueva"
git push origin main
```

5. **Деплой:**
- Cloudflare Pages автоматически деплоит

### Автоматизированный процесс

См. `AUTOMATION.md` или `AUTOMATION2.md`

## 🔍 SEO и sitemap.xml

### Генерация sitemap.xml

**Пример структуры:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Главная -->
  <url>
    <loc>https://casella.casa/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <!-- Тематические страницы -->
  <url>
    <loc>https://casella.casa/pages/servicios.html</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Объекты недвижимости -->
  <url>
    <loc>https://casella.casa/properties/venta/casa-001.html</loc>
    <lastmod>2025-01-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
```

### Автоматическая генерация

**Python скрипт:**
```python
import os
from datetime import datetime

def generate_sitemap():
    base_url = "https://casella.casa"
    sitemap = ['<?xml version="1.0" encoding="UTF-8"?>']
    sitemap.append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')

    # Главная страница
    sitemap.append(f'''
    <url>
        <loc>{base_url}/</loc>
        <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    ''')

    # Тематические страницы
    for page in os.listdir('pages'):
        if page.endswith('.html'):
            sitemap.append(f'''
    <url>
        <loc>{base_url}/pages/{page}</loc>
        <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
            ''')

    # Объекты недвижимости
    for category in os.listdir('properties'):
        category_path = os.path.join('properties', category)
        if os.path.isdir(category_path):
            for prop in os.listdir(category_path):
                if prop.endswith('.html'):
                    sitemap.append(f'''
    <url>
        <loc>{base_url}/properties/{category}/{prop}</loc>
        <lastmod>{datetime.now().strftime("%Y-%m-%d")}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>
                    ''')

    sitemap.append('</urlset>')

    with open('sitemap.xml', 'w') as f:
        f.write('\n'.join(sitemap))

if __name__ == '__main__':
    generate_sitemap()
```

## ⚙️ .gitignore

**Рекомендуемый .gitignore:**

```gitignore
# OS
.DS_Store
Thumbs.db

# Editor
.vscode/
.idea/
*.swp
*.swo

# Node modules (если используется)
node_modules/
package-lock.json

# Build
dist/
build/

# Logs
*.log
npm-debug.log*

# Environment
.env
.env.local

# Backups
*.backup
*.bak

# Temporary files
tmp/
temp/
*.tmp

# N8N data (если используется)
n8n-data/
n8n-files/
```

## 📈 Масштабирование структуры

### При росте до 500+ объектов

Рекомендуется:

1. **Использовать базу данных:**
   - PostgreSQL или SQLite
   - Хранить метаданные объектов
   - Динамическая генерация страниц

2. **JSON API:**
```json
// api/properties.json
{
  "properties": [
    {
      "id": "001",
      "category": "venta",
      "title": "Casa en Barrio Norte",
      "price": "$120,000",
      "url": "/properties/venta/casa-barrio-norte-001.html"
    }
  ]
}
```

3. **Pagination:**
```
properties/venta/page-1.html
properties/venta/page-2.html
properties/venta/page-3.html
```

## 📋 Чеклист структуры

При создании нового объекта проверьте:

- [ ] Файл находится в правильной папке (properties/[категория]/)
- [ ] Имя файла следует конвенции (тип-местоположение-номер.html)
- [ ] Навигация использует правильные относительные пути
- [ ] Все изображения загружены на CDN
- [ ] Файл добавлен в sitemap.xml (если вручную)
- [ ] Нет дублирующихся файлов
- [ ] Git commit с понятным сообщением

## 🎯 Лучшие практики

### ✅ DO (Делать)

1. **Группируйте по категориям**
   ```
   properties/venta/
   properties/alquiler/
   ```

2. **Используйте понятные имена файлов**
   ```
   casa-barrio-norte-001.html
   ```

3. **Поддерживайте единую структуру навигации**
   ```html
   <nav><!-- Одинаковое меню на всех страницах --></nav>
   ```

4. **Документируйте изменения**
   ```bash
   git commit -m "Add property: Casa 3 dorm en Barrio Norte"
   ```

### ❌ DON'T (Не делать)

1. **Не кладите все в корень**
   ```
   ❌ index.html, casa1.html, casa2.html, casa3.html...
   ```

2. **Не используйте пробелы в именах**
   ```
   ❌ Casa Barrio Norte.html
   ✅ casa-barrio-norte-001.html
   ```

3. **Не создавайте глубокую вложенность**
   ```
   ❌ properties/venta/casas/barrio-norte/3-dormitorios/casa.html
   ✅ properties/venta/casa-barrio-norte-001.html
   ```

4. **Не дублируйте файлы**
   ```
   ❌ casa-001.html И casa-001-backup.html
   ```

## 🔄 Миграция структуры

### Если у вас уже есть файлы в корне

**Скрипт для реорганизации:**

```bash
#!/bin/bash

# Создаем папки
mkdir -p properties/venta
mkdir -p properties/alquiler
mkdir -p properties/terrenos
mkdir -p properties/comercial

# Перемещаем файлы (пример)
mv casa-*-venta.html properties/venta/
mv depto-*-alquiler.html properties/alquiler/
mv terreno-*.html properties/terrenos/
mv local-*.html properties/comercial/

# Обновляем ссылки (требует ручной проверки)
echo "Don't forget to update links in HTML files!"
```

## 📞 Поддержка

Для вопросов о структуре проекта:
- **Email**: horaciocasella@yahoo.com.ar
- **WhatsApp**: +54 9 2657 609278

---

**Версия документа**: 1.0
**Дата**: 2025-01-15
**Автор**: Inmobiliaria Casella & Casella Development Team
