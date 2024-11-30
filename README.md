# Exchango - Aplicación de Conversión de Moneda

## Descripción
Esta es una aplicación moderna de conversión de moneda que permite a los usuarios registrarse, iniciar sesión y realizar conversiones de divisas en tiempo real.

## Requisitos previos

- Node.js (versión 18 o superior)
- PNPM (recomendado) o NPM
- PostgreSQL (recomendado usar Supabase)
- Cuenta en ExchangeRate-API para las tasas de cambio

## Instalación

### 1. Clonar el Repositorio
```bash
git clone git@github.com:xskuy/exchango.github.io.git
cd exchango.github.io
```

### 2. Instalar Dependencias
Con PNPM (recomendado):
```bash
pnpm install
```

O con NPM:
```bash
npm install --legacy-peer-deps
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
# Base de datos
DATABASE_URL="tu-url-de-base-de-datos"
DIRECT_URL="tu-url-directa-de-base-de-datos"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-seguro"

# API Key para el servicio de cambio
API_KEY="tu-api-key-de-exchangerate"
```

### 4. Inicializar la Base de Datos
```bash
pnpm prisma generate
pnpm prisma db push
```


Credenciales por defecto:
- Email: benja@ejemplo.com
- Contraseña: contraseña1

## Iniciar la Aplicación

### Desarrollo
```bash
pnpm dev
```

### Producción
```bash
pnpm build
pnpm start
```

La aplicación estará disponible en:
- Desarrollo: http://localhost:3000
- Producción: https://tu-dominio.com

## Características Principales

- 🔒 Autenticación segura
- 💱 Conversión de monedas en tiempo real
- 📊 Dashboard con estadísticas
- 📱 Diseño responsive
- 🌙 Modo oscuro/claro

## Tecnologías Utilizadas

- Next.js 14
- React 18
- TypeScript
- Prisma (ORM)
- NextAuth.js
- TailwindCSS
- Radix UI

## Estructura del Proyecto

```
exchango/
├── src/
│   ├── app/              # Rutas y páginas
│   ├── components/       # Componentes reutilizables
│   ├── context/         # Contextos de React
│   ├── lib/             # Utilidades y configuraciones
│   └── styles/          # Estilos globales
├── prisma/              # Esquema de base de datos
├── public/              # Archivos estáticos
└── scripts/            # Scripts de utilidad
```

## Solución de Problemas Comunes

### Error de Conexión a Base de Datos
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que la base de datos esté accesible
- Ejecuta `pnpm prisma generate` después de cambios en el esquema

### Error en las Tasas de Cambio
- Verifica que tu API_KEY sea válida
- Comprueba la cuota de solicitudes de tu plan

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.


