# Challenge 08 · Supabase + Ionic

Aplicación móvil/web para gestionar tareas personales con React, Ionic, Capacitor y Supabase. Incluye registro e inicio de sesión, operaciones CRUD protegidas por RLS, actualización en tiempo real y foto de perfil guardada en un bucket privado.

## Requisitos

- Node.js 22.12 o posterior
- Un proyecto Supabase gratuito
- Android Studio para compilar y ejecutar la app Android

## Configuración de Supabase

1. Crea un proyecto y guarda su contraseña de base de datos en un lugar seguro.
2. En **Project Settings → API Keys**, copia **Project URL** y la clave **Publishable** (`sb_publishable_…`). La clave pública es la única que debe ir en el cliente.
3. En **SQL Editor**, ejecuta el contenido completo de [`supabase/schema.sql`](./supabase/schema.sql). Esto crea `public.tareas`, activa las políticas RLS, habilita Realtime y crea el bucket privado `avatars` con políticas por carpeta.
4. En **Authentication → URL Configuration**, agrega la URL local de desarrollo `http://localhost:5173` como Site URL. En **Sign In / Providers**, deja Email habilitado. Para una práctica local, puedes desactivar la confirmación de correo; si queda activa, cada estudiante debe confirmar su correo.
5. Copia `.env.example` como `.env` y reemplaza sus dos valores:

   ```dotenv
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_KEY=sb_publishable_tu_clave_publica
   ```

No uses una clave `secret` o `service_role` en una app cliente. El acceso a cada fila y archivo se controla con RLS, no ocultando la clave publicable. Los archivos `.env` están excluidos de Git.

## Ejecutar en navegador

Desde esta carpeta:

```bash
npm install
npm run dev
```

Abre la dirección que muestra Vite. Crea una cuenta o inicia sesión; si Email confirmation está habilitado, confirma el correo antes de entrar. Las tareas se leen y modifican con la sesión del usuario.

## Ejecutar en Android

Instala dependencias y sincroniza Capacitor desde esta carpeta:

```bash
npm install
npm run build
npx cap sync android
npx cap open android
```

La app usa el plugin Camera para tomar una foto o elegir una imagen. La primera vez, Android solicitará el permiso correspondiente.

## Seguridad y datos

- Las políticas de `public.tareas` permiten a cada usuario consultar, insertar, actualizar y eliminar solo filas cuyo `user_id` coincide con su identidad autenticada.
- El bucket `avatars` es privado. Cada objeto usa la ruta `<user_id>/avatar.jpg`; las políticas limitan lectura, carga, reemplazo y eliminación a esa carpeta.
- Realtime entrega cambios a la app y la consulta vuelve a aplicar el filtro del usuario y las políticas RLS.
- La app registra la ruta del avatar en los metadatos de Auth y muestra una URL firmada de corta duración.

## Comprobaciones

```bash
npm test
npm run lint
npm run build
```

Las pruebas unitarias cubren normalización del título y filtros de tareas. Las operaciones con Supabase requieren completar la configuración del proyecto para probarse en vivo.
