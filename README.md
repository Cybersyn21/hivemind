# 🏠 Inmobiliaria Casella & Casella

Sitio web profesional para agencia inmobiliaria en Villa Mercedes, San Luis, Argentina.

## 📋 Estructura del Proyecto

```
casella.casa/
├── index.html                 # Página principal
├── properties/                # Carpeta de propiedades
│   ├── venta/                # Propiedades en venta
│   │   └── ejemplo-casa.html
│   ├── alquiler/             # Propiedades en alquiler
│   │   └── ejemplo-depto.html
│   └── terrenos/             # Terrenos disponibles
│       └── ejemplo-terreno.html
├── templates/                 # Plantillas reutilizables
│   ├── property-template.html
│   └── listing-template.html
└── README.md                  # Este archivo
```

## 🚀 Características

- ✅ **Una sola página HTML** - Todo el código (HTML, CSS, JS) en un archivo
- ✅ **Tailwind CSS via CDN** - Sin necesidad de compilación
- ✅ **Responsive Design** - Adaptable a móviles, tablets y desktop
- ✅ **Modo Oscuro/Claro** - Tema personalizable
- ✅ **WhatsApp Integration** - Botón flotante con animación
- ✅ **Animaciones AOS** - Efectos visuales al hacer scroll
- ✅ **Optimizado para SEO** - Meta tags y estructura semántica

## 📱 Contacto

- **Titular**: CASELLA HORACIO
- **Matrícula**: Martillero Público M.P. 1062
- **Celular**: 2657-609278
- **WhatsApp**: +5492657609278
- **Teléfono**: 02657-424494
- **Email**: horaciocasella@yahoo.com.ar
- **Dirección**: Betbeder 46 – Villa Mercedes, San Luis

## 🤖 Prompts para Generar Descripciones de Propiedades

### Prompt Base para Descripción de Propiedad

```
Crea una descripción profesional y atractiva para una propiedad inmobiliaria con las siguientes características:

TIPO DE PROPIEDAD: [Casa/Departamento/Terreno/Local Comercial]
TIPO DE OPERACIÓN: [Venta/Alquiler]
UBICACIÓN: [Barrio, Ciudad]
CARACTERÍSTICAS:
- Superficie: [m²]
- Dormitorios: [número]
- Baños: [número]
- Características especiales: [garage, patio, piscina, etc.]
- Estado: [A estrenar/Buen estado/A refaccionar]
- Precio: [Consultar/Monto]

PUNTOS DESTACADOS:
- [Característica 1]
- [Característica 2]
- [Característica 3]

La descripción debe:
1. Tener un título atractivo
2. Describir las características principales
3. Mencionar la ubicación y servicios cercanos
4. Incluir un llamado a la acción
5. Ser profesional pero cálida
6. Tener entre 150-250 palabras
```

### Prompt para Redes Sociales - WhatsApp

```
Genera una descripción para WhatsApp de esta propiedad:

DATOS:
- Tipo: [Casa/Depto/Terreno/Local]
- Operación: [Venta/Alquiler]
- Ubicación: [Ubicación]
- Características: [características principales]
- Precio: [Precio o "Consultar"]

FORMATO REQUERIDO:
- Usar emojis relevantes 🏠 🔑 📍 💰 ✨
- Máximo 4 líneas de texto
- Incluir llamado a la acción
- Mensaje directo y conciso
- Incluir link o forma de contacto

Ejemplo de estructura:
🏠 [Título atractivo con emoji]
📍 [Ubicación] | [Características clave]
✨ [Característica destacada]
💰 [Precio/Consultar] | 📲 Consultas: [WhatsApp]
```

### Prompt para Facebook e Instagram

```
Crea una publicación para Facebook/Instagram sobre esta propiedad:

INFORMACIÓN:
- Tipo: [Tipo de propiedad]
- Operación: [Venta/Alquiler]
- Ubicación: [Ubicación]
- Características: [Lista de características]
- Aspectos destacados: [Lo mejor de la propiedad]

REQUISITOS:
- Usar emojis estratégicamente
- Primera línea impactante que capture atención
- 3-5 líneas de descripción
- Hashtags relevantes (#VillaMercedes #SanLuis #Inmobiliaria, etc.)
- Llamado a la acción claro
- Tono profesional pero cercano
- Generar curiosidad para ver más fotos

Incluir sección de hashtags al final:
#InmobiliariaCasella #PropiedadesVillaMercedes #[TipoPropiedad][Venta/Alquiler] #SanLuis
```

### Prompt para Telegram

```
Genera mensaje para canal de Telegram sobre esta propiedad:

DATOS DE LA PROPIEDAD:
- Tipo: [Tipo]
- Operación: [Venta/Alquiler]
- Ubicación: [Ubicación]
- Características: [Características]
- Precio: [Precio]

FORMATO:
- Usar emojis para organizar información
- Formato de lista con bullets
- Información clara y estructurada
- Link de contacto directo a WhatsApp
- Máximo 8 líneas

Estructura sugerida:
🏠 [TÍTULO EN MAYÚSCULAS]

📍 Ubicación: [ubicación]
📐 Superficie: [m²]
🛏 Dormitorios: [número]
🚿 Baños: [número]
[Otros íconos según características]

💰 Precio: [precio/consultar]

📲 Consultas: wa.me/5492657609278
```

## 📝 Plantilla para Generar Página de Propiedad

```
Genera el código HTML completo para una página de propiedad individual usando este template:

DATOS:
- ID: [código único]
- Título: [título]
- Tipo: [Casa/Depto/Terreno/Local]
- Operación: [Venta/Alquiler]
- Precio: [precio o "Consultar"]
- Ubicación: [dirección/zona]
- Superficie: [m²]
- Dormitorios: [número]
- Baños: [número]
- Garage: [sí/no]
- Características: [lista de características]
- Descripción completa: [descripción detallada]
- Servicios cercanos: [lista]
- URLs de imágenes: [lista de URLs]
- Video (opcional): [URL de YouTube/Vimeo]

REQUISITOS TÉCNICOS:
- Usar Tailwind CSS via CDN (https://cdn.tailwindcss.com)
- Todo en un solo archivo HTML
- Incluir galería de imágenes
- Botón de WhatsApp flotante
- Formulario de contacto
- Mapa de ubicación (Google Maps embed)
- Sección de características con iconos
- Responsive design
- Modo oscuro/claro
- Meta tags para SEO
- Botón para compartir en redes sociales

COLORES DEL TEMA:
- Primary: #c29541 (dorado)
- Secondary: #a07c34
- Emerald: #25D366 (WhatsApp)

CONTACTO:
- WhatsApp: +5492657609278
- Email: horaciocasella@yahoo.com.ar
- Teléfono: 02657-424494
```

## 🎨 Ejemplo de Uso de Prompts

### Ejemplo 1: Casa en Venta

**Input para el prompt:**
```
Tipo: Casa
Operación: Venta
Ubicación: Barrio La Ribera, Villa Mercedes
Superficie: 180 m²
Dormitorios: 3
Baños: 2
Características: Garage para 2 autos, patio con quincho, calefacción central
Estado: Buen estado
Puntos destacados:
- Amplio living comedor con mucha luz natural
- Cocina completamente equipada
- Ubicación cercana a escuelas y comercios
```

**Output esperado para WhatsApp:**
```
🏠 HERMOSA CASA EN VENTA - BARRIO LA RIBERA
📍 Villa Mercedes | 3 dorm 🛏️ | 2 baños 🚿 | 180m² | Garage x2 🚗
✨ Living luminoso, cocina equipada, quincho ideal para reuniones
💰 Consultar precio | 📲 WhatsApp: +54 9 2657 609278
```

### Ejemplo 2: Departamento en Alquiler

**Input:**
```
Tipo: Departamento
Operación: Alquiler
Ubicación: Centro, Villa Mercedes
Superficie: 65 m²
Dormitorios: 2
Baños: 1
Características: Balcón, cocina integrada, muy luminoso
Estado: A estrenar
Precio: $80,000/mes
```

**Output para Instagram:**
```
✨ ¡DEPARTAMENTO CÉNTRICO A ESTRENAR! 🏢

🌟 2 ambientes llenos de luz en pleno centro de Villa Mercedes
🔑 A estrenar | Balcón | Cocina integrada | Todo a mano

📍 Ubicación privilegiada: comercios, bancos y servicios a pasos

💰 $80.000/mes

📩 ¡No te lo pierdas! Contactanos para coordinar visita

#InmobiliariaCasella #AlquilerVillaMercedes #DepartamentoCentro #SanLuis #PropiedadesEnAlquiler #VillaMercedes #NuevoHogar
```

## 🛠️ Instrucciones para Agregar Nueva Propiedad

### Paso 1: Usar el Prompt de Generación
Copia el "Prompt para Generar Página de Propiedad" y completa todos los datos.

### Paso 2: Guardar el Archivo
Guarda el HTML generado en la carpeta correspondiente:
- `/properties/venta/` para propiedades en venta
- `/properties/alquiler/` para alquileres
- `/properties/terrenos/` para terrenos

Nombre sugerido: `[tipo]-[ubicacion]-[id].html`
Ejemplo: `casa-barrio-norte-001.html`

### Paso 3: Generar Descripciones para Redes
Usa los prompts específicos para cada red social y guarda las descripciones.

### Paso 4: Publicar
1. Sube la página HTML al repositorio
2. Publica en Cloudflare Pages
3. Comparte el link en redes sociales con las descripciones generadas

## 📤 Deploy en Cloudflare Pages

1. Conecta tu repositorio de GitHub
2. Configura el proyecto:
   - **Build command**: (dejar vacío)
   - **Build output directory**: `/`
   - **Root directory**: `/`
3. Dominio personalizado: `casella.casa`

## 🎯 Mejores Prácticas

### Para Imágenes:
- Usar imágenes de alta calidad
- Formato recomendado: JPG (comprimido)
- Tamaño recomendado: 1920x1080px
- Incluir al menos 5 fotos por propiedad
- Foto principal debe ser la más atractiva

### Para Descripciones:
- Ser honesto y preciso
- Destacar características únicas
- Mencionar ubicación y servicios cercanos
- Incluir palabras clave (barrio, ciudad, tipo)
- Revisar ortografía y gramática

### Para Redes Sociales:
- Publicar en horarios de mayor actividad
- Usar hashtags locales
- Incluir siempre llamado a la acción
- Responder rápido a consultas
- Actualizar disponibilidad

## 📞 Soporte

Para cualquier consulta sobre el sitio web, contactar a:
- **Email**: horaciocasella@yahoo.com.ar
- **WhatsApp**: +54 9 2657 609278

---

**Inmobiliaria Casella & Casella**
*Tu confianza, nuestra mejor recomendación*
Villa Mercedes, San Luis - Argentina
