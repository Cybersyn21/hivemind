# 📦 Guía de Transferencia de Archivos a casella.casa

## 🎯 Archivos Creados

Se han creado **DOS** versiones del sitio web:

### 1. 📄 Versión HTML Estática (`casella-site/`)
- Sitio estático completo
- No requiere compilación
- Listo para Cloudflare Pages
- **Ubicación**: `/casella-site/`

### 2. ⚡ Versión Vue3 (`casella.casa2/`)
- Aplicación SPA moderna
- Requiere Node.js y npm
- Build con Vite
- **Ubicación**: `/casella.casa2/`

---

## 📋 Instrucciones de Transferencia

### Método 1: Copia Manual (Recomendado)

#### Para la versión HTML estática:

1. **Clone el repositorio casella.casa**:
```bash
git clone https://github.com/Cybersyn21/casella.casa.git
cd casella.casa
```

2. **Copie los archivos de casella-site**:
```bash
# Desde el repositorio hivemind, copie todo el contenido de casella-site/
cp -r /ruta/a/hivemind/casella-site/* .
```

3. **Commit y push**:
```bash
git add .
git commit -m "Add Casella & Casella real estate website"
git push origin main
```

#### Para la versión Vue3:

1. **Dentro del repositorio casella.casa, cree la carpeta**:
```bash
mkdir casella.casa2
```

2. **Copie los archivos**:
```bash
cp -r /ruta/a/hivemind/casella.casa2/* casella.casa2/
```

3. **Commit y push**:
```bash
git add casella.casa2/
git commit -m "Add Vue3 version of Casella website"
git push origin main
```

---

### Método 2: Usando Git Subtree

```bash
# Clone casella.casa
git clone https://github.com/Cybersyn21/casella.casa.git
cd casella.casa

# Agregue hivemind como remote
git remote add hivemind https://github.com/Cybersyn21/hivemind.git

# Fetch
git fetch hivemind

# Merge los archivos específicos
git read-tree --prefix=/ -u hivemind/claude/create-casella-website-01P2nEvQkBAw7gF38pHTSAxs:casella-site

# Commit
git commit -m "Add website files from hivemind"

# Push
git push origin main
```

---

### Método 3: Download y Upload Manual

1. **Descargue los archivos**:
   - Vaya a: https://github.com/Cybersyn21/hivemind/tree/claude/create-casella-website-01P2nEvQkBAw7gF38pHTSAxs
   - Descargue la carpeta `casella-site/` y `casella.casa2/`

2. **Suba al repositorio casella.casa**:
   - Clone: `git clone https://github.com/Cybersyn21/casella.casa.git`
   - Copie manualmente las carpetas
   - Commit y push

---

## 📂 Estructura Final Esperada

### En el repositorio casella.casa:

```
casella.casa/
├── index.html                  # De casella-site/
├── README.md                   # De casella-site/
├── DEPLOYMENT.md               # De casella-site/
├── PROMPTS-GUIDE.md            # De casella-site/
├── .gitignore                  # De casella-site/
├── templates/                  # De casella-site/
│   └── property-template.html
├── properties/                 # De casella-site/
│   ├── venta/
│   │   └── casa-barrio-norte-001.html
│   ├── alquiler/
│   └── terrenos/
└── casella.casa2/              # Carpeta Vue3 completa
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── src/
    │   ├── App.vue
    │   ├── main.js
    │   ├── components/
    │   ├── views/
    │   └── router/
    └── README.md
```

---

## ✅ Verificación Post-Transfer

### Para la versión HTML:

1. **Abra `index.html` en el navegador**
   - Verifique que se carga correctamente
   - Compruebe todos los links
   - Verifique el botón de WhatsApp

2. **Deploy en Cloudflare Pages**
   - Ver: `DEPLOYMENT.md`

### Para la versión Vue3:

1. **Instale dependencias**:
```bash
cd casella.casa2
npm install
```

2. **Ejecute en desarrollo**:
```bash
npm run dev
```

3. **Verifique que funciona**:
   - Abra http://localhost:5173
   - Pruebe la navegación
   - Verifique el tema oscuro/claro
   - Compruebe el botón de WhatsApp

4. **Build para producción**:
```bash
npm run build
```

---

## 🚀 Deploy a Producción

### Versión HTML → Cloudflare Pages

1. **Conecte el repositorio** en Cloudflare Pages
2. **Configure**:
   - Build command: *(vacío)*
   - Build output: `/`
   - Root directory: `/`
3. **Deploy!**

### Versión Vue3 → Cloudflare Pages

1. **Conecte el repositorio** en Cloudflare Pages
2. **Configure**:
   - Build command: `npm run build`
   - Build output: `dist`
   - Root directory: `casella.casa2`
3. **Variables de entorno**: *(ninguna necesaria)*
4. **Deploy!**

---

## 🔧 Configuración de Dominio

Una vez desplegado:

1. **Vaya a Custom Domains** en Cloudflare Pages
2. **Agregue**:
   - `casella.casa` → Versión HTML (raíz)
   - `vue.casella.casa` → Versión Vue3 (subdomain)
3. **DNS se configurará automáticamente**

---

## 📝 Archivos Importantes

### Versión HTML:
- **`index.html`** - Página principal
- **`README.md`** - Documentación completa con prompts
- **`DEPLOYMENT.md`** - Guía de deploy
- **`PROMPTS-GUIDE.md`** - Guía de uso de AI prompts
- **`templates/property-template.html`** - Plantilla para propiedades

### Versión Vue3:
- **`package.json`** - Dependencias
- **`src/App.vue`** - Componente raíz
- **`src/main.js`** - Entry point
- **`src/views/Home.vue`** - Página principal
- **`README.md`** - Documentación Vue3

---

## 💡 Tips

1. **Mantenga ambas versiones** actualizadas
2. **Use la versión HTML** si quiere rapidez (no build)
3. **Use la versión Vue3** para funcionalidad avanzada
4. **Los prompts de AI** funcionan para ambas versiones
5. **WhatsApp está integrado** en ambas: +5492657609278

---

## 🆘 Soporte

Si tiene problemas:

1. **Revise los README** en cada carpeta
2. **Verifique los logs** de build
3. **Consulte DEPLOYMENT.md**
4. **Contacte** a horaciocasella@yahoo.com.ar

---

**¡Éxito con el deploy!** 🎉

Inmobiliaria Casella & Casella
Villa Mercedes, San Luis
