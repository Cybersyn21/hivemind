# 🏠 Inmobiliaria Casella & Casella - Vue3 Version

Sitio web moderno desarrollado con Vue 3 + Vite + Tailwind CSS para Inmobiliaria Casella & Casella en Villa Mercedes, San Luis, Argentina.

## 🚀 Características

- ✅ **Vue 3** con Composition API
- ✅ **Vite** - Build tool ultra rápido
- ✅ **Vue Router** - Navegación SPA
- ✅ **Tailwind CSS** - Estilos utility-first
- ✅ **Dark Mode** - Tema oscuro/claro
- ✅ **Responsive Design** - Adaptable a todos los dispositivos
- ✅ **AOS Animations** - Animaciones on scroll
- ✅ **WhatsApp Integration** - Botón flotante con integración directa
- ✅ **Modern JavaScript** - ES6+ features

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0

## 🔧 Instalación

```bash
# Instalar dependencias
npm install
```

## 💻 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El sitio estará disponible en http://localhost:5173
```

## 🏗️ Build para Producción

```bash
# Compilar para producción
npm run build

# Los archivos compilados estarán en la carpeta dist/
```

## 👀 Preview del Build

```bash
# Previsualizar el build de producción
npm run preview
```

## 📁 Estructura del Proyecto

```
casella.casa2/
├── public/                  # Archivos estáticos
├── src/
│   ├── assets/             # Assets (CSS, imágenes)
│   │   └── main.css        # Estilos globales con Tailwind
│   ├── components/         # Componentes reutilizables
│   │   ├── Header.vue      # Header con navegación
│   │   ├── Footer.vue      # Footer
│   │   └── PropertyCard.vue # Tarjeta de propiedad
│   ├── views/              # Páginas/Vistas
│   │   ├── Home.vue        # Página principal
│   │   └── PropertyDetail.vue # Detalle de propiedad
│   ├── router/             # Configuración de rutas
│   │   └── index.js        # Router de Vue
│   ├── App.vue             # Componente raíz
│   └── main.js             # Punto de entrada
├── index.html              # HTML principal
├── package.json            # Dependencias
├── vite.config.js          # Configuración de Vite
├── tailwind.config.js      # Configuración de Tailwind
└── postcss.config.js       # Configuración de PostCSS
```

## 🎨 Personalización

### Colores del Tema

Los colores se definen en `tailwind.config.js`:

```javascript
colors: {
  primary: '#c29541',      // Dorado principal
  secondary: '#a07c34',    // Dorado secundario
  accent: '#856826',       // Acento
  emerald: '#25D366'       // WhatsApp green
}
```

### Agregar Nueva Propiedad

1. Edita `src/views/Home.vue`
2. Agrega el objeto de propiedad al array `properties`:

```javascript
{
  id: 4,
  image: 'URL_DE_LA_IMAGEN',
  title: 'Título de la Propiedad',
  location: 'Ubicación',
  type: 'Venta', // o 'Alquiler' o 'Terreno'
  bedrooms: 3,
  bathrooms: 2,
  surface: 120,
  garage: true,
  price: 'Consultar'
}
```

## 📱 Contacto Integrado

El sitio incluye integración con WhatsApp:
- **Número**: +5492657609278
- **Botón flotante** siempre visible
- **Formularios** que envían directamente a WhatsApp

Para cambiar el número, busca y reemplaza `5492657609278` en todos los archivos.

## 🌐 Deploy en Producción

### Opción 1: Cloudflare Pages

1. Conecta tu repositorio de GitHub
2. Configura:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `casella.casa2` (si está en una subcarpeta)

### Opción 2: Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Opción 3: Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

# Build y deploy
npm run build
netlify deploy --prod --dir=dist
```

## 🔄 Actualizar Dependencias

```bash
# Ver dependencias desactualizadas
npm outdated

# Actualizar todas las dependencias
npm update

# Actualizar a las últimas versiones
npx npm-check-updates -u
npm install
```

## 🐛 Debugging

### Problema: El sitio no carga

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules
npm install
```

### Problema: Cambios no se reflejan

```bash
# Reiniciar servidor de desarrollo
# Ctrl+C para detener
npm run dev
```

### Problema: Error de build

```bash
# Verificar versión de Node
node -v  # Debe ser >= 18

# Limpiar cache de Vite
rm -rf node_modules/.vite
npm run dev
```

## 📝 Diferencias con la Versión HTML

| Característica | Versión HTML | Versión Vue3 |
|----------------|-------------|--------------|
| Framework | Ninguno | Vue 3 |
| Routing | Hash links | Vue Router (SPA) |
| Estado | DOM directo | Reactive state |
| Componentes | No | Sí, reutilizables |
| Build | No requiere | Vite |
| Performance | Buena | Excelente |
| Mantenibilidad | Media | Alta |

## 🎯 Próximos Pasos

- [ ] Integrar API para gestión de propiedades
- [ ] Agregar sistema de autenticación admin
- [ ] Implementar filtros avanzados
- [ ] Agregar comparador de propiedades
- [ ] Integrar pasarela de pago
- [ ] Agregar blog/noticias
- [ ] Implementar sistema de favoritos
- [ ] Agregar tour virtual 360°

## 📞 Soporte

Para consultas sobre el sitio web:
- **Email**: horaciocasella@yahoo.com.ar
- **Teléfono**: 02657-424494
- **Celular**: 2657-609278
- **WhatsApp**: +54 9 2657 609278

## 📄 Licencia

© 2025 Inmobiliaria Casella & Casella. Todos los derechos reservados.

---

**Desarrollado con ❤️ para Inmobiliaria Casella & Casella**

Villa Mercedes, San Luis - Argentina
