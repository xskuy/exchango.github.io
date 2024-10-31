# Aplicación de Conversión de Moneda

Esta es una aplicación de conversión de moneda que permite a los usuarios registrarse, iniciar sesión y realizar conversiones de divisas.

## Requisitos previos

- Node.js (versión 14 o superior)
- npm (normalmente viene con Node.js)
- PostgreSQL

## Instalación

1. Clona este repositorio:
   ```
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Copia el archivo `.env.example` a `.env` y configura las variables de entorno:
   ```
   cp .env.example .env
   ```
   Asegúrate de configurar correctamente la URL de la base de datos y otras variables necesarias.

4. Configura la base de datos con Prisma:
   ```
   npx prisma generate
   npx prisma db push
   ```
## Agregar un usuario

Para agregar un nuevo usuario, Ejecuta el siguiente comando:

```
npx ts-node -P tsconfig.scripts.json scripts/addUser.ts
```

## Uso

1. Inicia el servidor de desarrollo:
   ```
   npm run dev
   ```

2. Abre tu navegador y visita `http://localhost:3000`


3. Si se ejecuto el comando para crear el usuario las credendicales deberian ser:
Email: benja@ejemplo.com
Contraseña: contraseña1


