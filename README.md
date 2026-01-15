# Portafolio Frontend - Angular v21

Portafolio personal desarrollado con Angular v21, Standalone Components, Signals y TailwindCSS.

## 🚀 Características

- ✅ Angular v21+ con Standalone Components
- ✅ Signals para estado reactivo
- ✅ TailwindCSS para estilos
- ✅ Sistema de i18n nativo (ES/EN) con Signals
- ✅ Diseño Bento Grid + Glassmorphism
- ✅ Dark Mode por defecto
- ✅ Consumo de API Laravel

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Backend Laravel corriendo en `http://localhost:8000`

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (con proxy configurado)
npm run start:proxy

# O simplemente
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🔧 Configuración

### Proxy para Desarrollo

El proyecto incluye un `proxy.conf.json` que redirige las peticiones `/api/*` al backend Laravel en `http://localhost:8000`.

Si necesitas cambiar la URL del backend, edita `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  }
}
```

### Variables de Entorno

Para producción, puedes crear un archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.josueortiz.dev'
};
```

Y actualizar `ApiService` para usar esta variable.

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces TypeScript
│   │   └── services/        # Servicios (API, i18n)
│   ├── components/
│   │   ├── layout/          # Header, Footer
│   │   └── sections/        # Hero, About, Skills, etc.
│   ├── app.ts              # Componente principal
│   └── app.config.ts       # Configuración de la app
├── styles.css              # Estilos globales (Tailwind)
└── main.ts                 # Punto de entrada
```

## 🌐 Sistema de i18n

El sistema de internacionalización usa Signals nativos de Angular:

```typescript
// En cualquier componente
protected readonly i18n = inject(I18nService);

// Obtener texto según idioma
{{ i18n.getText(textoEs, textoEn) }}

// Cambiar idioma
i18n.setLanguage('en');
i18n.toggleLanguage();
```

## 🎨 Estilos

El proyecto usa TailwindCSS con clases personalizadas:

- `.glass` - Efecto glassmorphism
- `.glass-dark` - Glassmorphism oscuro
- `.bento-card` - Tarjeta estilo Bento Grid

## 📝 Próximos Pasos

1. Completar las secciones (About, Skills, Projects, etc.)
2. Implementar animaciones con Framer Motion o nativas
3. Optimizar imágenes y assets
4. Configurar SEO
5. Testing

## 🔗 Enlaces

- Backend API: `http://localhost:8000/api`
- Frontend: `http://localhost:4200`
