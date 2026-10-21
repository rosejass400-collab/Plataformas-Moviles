# Challenge 08 — Mis pendientes

Aplicación de tareas personales para Desarrollo de Plataformas Móviles. Usa React, componentes Ionic, Capacitor y Supabase. La interfaz combina azul oscuro, naranja y fondo gris claro.

## Funciones

- Registro, confirmación por correo e inicio/cierre de sesión.
- Crear tareas, consultar la lista, editar el título, completar y eliminar.
- Filtros de todas, pendientes y completadas, con contadores.
- Actualización en tiempo real entre ventanas abiertas.
- Tomar una foto o elegir una imagen para el perfil. El archivo se guarda en un bucket privado.

## Organización del código

| Archivo | Responsabilidad |
| --- | --- |
| `src/App.jsx` | Recupera la sesión y decide qué pantalla mostrar. |
| `src/components/AuthPanel.jsx` | Registro e inicio de sesión. |
| `src/components/TasksPanel.jsx` | CRUD, filtros y suscripción a Realtime. |
| `src/components/ProfilePhoto.jsx` | Cámara, carga de imágenes y enlaces firmados. |
| `src/lib/supabase.js` | Configura el cliente con variables de entorno. |
| `src/lib/task-utils.js` | Normaliza títulos y filtra tareas. |
| `src/index.css` | Colores, distribución y adaptación al celular. |
| `supabase/schema.sql` | Tabla, permisos, políticas RLS, Realtime y bucket. |

## Instalación local

Requiere Node.js 22.12 o superior y un proyecto Supabase.

1. En Supabase, ejecuta `supabase/schema.sql` completo desde SQL Editor, en un proyecto dedicado a este challenge.
2. En **Connect → Framework → React**, copia Project URL y Publishable key.
3. Copia `.env.example` a `.env` y completa:

   ```dotenv
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_tu_clave_publica
   ```

4. En **Authentication → URL Configuration**, configura Site URL y Redirect URLs con el origen donde funcionará la app. Para desarrollo se puede usar `http://127.0.0.1:5173/`.
5. Conserva la confirmación por correo activada. Regístrate con una dirección a cuya bandeja puedas acceder.
6. Ejecuta desde esta carpeta:

   ```bash
   npm ci
   npm run dev -- --host 127.0.0.1
   ```

Abre la dirección que muestra Vite. Cada usuario utiliza su propia cuenta.

## Seguridad

La tabla `tareas` contiene `id`, `titulo`, `completada`, `user_id` y `created_at`. Las cuatro políticas RLS comparan `auth.uid()` con `user_id`. El filtro del cliente facilita la consulta, pero la protección real está en la base de datos. Las solicitudes sin sesión no tienen permisos sobre la tabla.

El bucket `avatars` es privado. Las rutas siguen `<user_id>/avatar.<extension>` y las políticas permiten gestionar únicamente la carpeta propia. La app valida imágenes JPG, PNG, WebP o GIF de hasta 5 MB; esta validación de tamaño y formato se hace en el cliente. El límite general del bucket lo administra Supabase.

La ruta del avatar se guarda en los metadatos de Auth. Para mostrarlo se solicita una URL firmada de una hora, renovada mientras la pantalla permanece abierta. La clave publicable no sustituye a la sesión ni a RLS. Nunca se usa `secret` ni `service_role` en el frontend. `.env` está excluido de Git.

Realtime notifica inserciones, actualizaciones y borrados. Los eventos solo provocan una nueva consulta protegida por RLS. Los eventos DELETE no permiten filtrar por `user_id`; su identificador no se utiliza para mostrar contenido de otros usuarios.

## Android y cámara

```bash
npm run build
npx cap sync android
npx cap open android
```

Android Studio permite compilar y ejecutar en un dispositivo o emulador. Camera ofrece captura o selección de foto. En navegador se usan los elementos PWA de Ionic; la captura requiere permiso de cámara y HTTPS o localhost. Seleccionar una imagen funciona también sin cámara.

## Publicación web

```bash
npm run build
```

Publica solo la carpeta `dist` en un servicio de alojamiento estático, por ejemplo Netlify. La URL y clave publicable se incorporan al compilar; al cambiarlas es necesario generar y publicar `dist` de nuevo. No subas `.env`, `node_modules` ni archivos de sesión.

En Supabase configura la dirección HTTPS publicada como **Site URL** y agrégala a **Redirect URLs**. Esto permite volver a la app después de confirmar el correo. La dirección `127.0.0.1` solo sirve en el computador donde corre el servidor local.

La entrega del código debe integrarse desde `challenge-08` hacia `main`, en `Corte 2/08 - Challenge 08`. La carpeta de Challenge 07 se conserva sin modificaciones.

## Verificación

```bash
npm test
npm run lint
npm run build
npx cap sync android
```

Pruebas automatizadas: normalización de títulos y filtros. Consulta `VERIFICACION.md` para distinguir las comprobaciones realizadas de las pendientes.

## Explicación para la presentación

1. **React** mantiene el estado de la sesión, formularios y lista.
2. **Ionic** aporta controles como `IonInput`, `IonButton`, `IonList`, `IonCheckbox` e `IonAlert`.
3. **Supabase Auth** identifica al usuario; **Postgres y RLS** guardan y protegen sus tareas.
4. **Realtime** avisa de cambios y vuelve a cargar la lista, sin recargar la página.
5. **Capacitor Camera** obtiene la imagen; **Storage** la guarda de forma privada.

Para demostrarlo: entrar, crear una tarea, editarla, completarla, filtrar, abrir una segunda ventana para observar cambios y subir una foto.
