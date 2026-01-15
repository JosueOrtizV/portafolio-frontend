# Configuración de Deployment Automático a Hostinger

Este proyecto está configurado para desplegarse automáticamente a Hostinger mediante GitHub Actions cuando se hace push a la rama `master`.

## Configuración de GitHub Secrets

Necesitas configurar los siguientes secrets en tu repositorio de GitHub:

1. Ve a **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

2. Agrega los siguientes secrets:

### Secrets Requeridos:

- **FTP_SERVER**: El servidor FTP de Hostinger
  - Ejemplo: `ftp.api.josueortiz.dev`

- **FTP_USERNAME**: El nombre de usuario FTP
  - Ejemplo: `u751518240.PortafolioFront`

- **FTP_PASSWORD**: La contraseña del usuario FTP

- **FTP_PUBLIC_DIR**: El directorio público donde se subirán los archivos
  - Ejemplo: `/public_html` o `/home/u751518240/domains/api.josueortiz.dev/public_html`

- **FTP_ROOT_DIR**: El directorio raíz del servidor FTP (opcional, para algunos casos)
  - Ejemplo: `/home/u751518240/domains/api.josueortiz.dev`

## Estructura de Deployment

El workflow:
1. Hace checkout del código
2. Instala las dependencias con `npm ci`
3. Construye el proyecto con `npm run build:prod`
4. Sube el contenido de `dist/browser/` a `public_html` en Hostinger

## Activación Manual

También puedes activar el deployment manualmente:
1. Ve a **Actions** en tu repositorio de GitHub
2. Selecciona el workflow **Build and Deploy to Hostinger**
3. Haz click en **Run workflow**
4. Selecciona la rama y haz click en **Run workflow**

## Notas

- El deployment se ejecuta automáticamente en cada push a `master`
- Los archivos se suben desde `dist/browser/` a `public_html`
- El workflow excluye archivos innecesarios como `.git`, `node_modules`, etc.
