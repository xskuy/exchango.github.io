# Aplicación de Conversión de Moneda

Esta es una aplicación de conversión de moneda que permite a los usuarios registrarse, iniciar sesión y realizar conversiones de divisas.

## Requisitos previos

- Node.js (versión 14 o superior)
- npm (normalmente viene con Node.js)
- SLQlite

## Instalación

1. Clona este repositorio:
   ```
   git clone git@github.com:xskuy/exchango.github.io.git
   cd exchango.github.io.git
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Cree un archivo de configuración .env en la raíz del proyecto:
   ```
   touch .env
   ```
   Y copiar los siguientes valores que estan en el archivo que se adjuta

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


