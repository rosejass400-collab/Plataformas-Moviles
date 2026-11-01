# Parcial 2 — Misiones

App Ionic + React + Capacitor para Android. Permite registrarse o iniciar sesión, completar tres misiones, ganar puntos y consultar progreso, resultados y ranking.

## Misiones

| Misión | Condición | Puntos |
| --- | --- | ---: |
| Tomar foto | La cámara toma una imagen y se guarda en el almacenamiento local de la app | 30 |
| Moverse 50 metros | GPS preciso; detecta el cambio después de 30 m y confirma el recorrido con dos lecturas desde 50 m | 50 |
| Quieto 10 segundos | Se desbloquea después del recorrido; el acelerómetro comprueba inmovilidad, luego vibra | 40 |

Al completar una misión se envían los puntos a Cloud Firestore. Firebase y `localStorage` guardan `{ points, missions }`, donde `missions` es una lista de objetos `{ id, completed }` con los identificadores 1, 2 y 3. La foto queda en IndexedDB del dispositivo. Las notificaciones locales avisan al completar una misión y cuando falta una. El ranking muestra hasta cinco cuentas registradas, con sus puntos reales; el lugar del usuario se calcula frente a las demás cuentas. No se crean participantes ficticios.

## Ejecutar

1. Instalar dependencias: `npm install`.
2. Copiar `.env.example` a `.env`. Estos son valores públicos de configuración del cliente Firebase, sin credenciales de administrador.
3. Iniciar en el navegador: `npm run dev`.
4. Para Android: `npm run build`, `npx cap sync android` y abrir la carpeta `android` en Android Studio.

Firebase usa el proyecto **parcial-2-misiones**. Authentication tiene habilitado correo y contraseña. Las reglas activas de Firestore están reproducidas en `firestore.rules`. La app necesita permiso de cámara, ubicación precisa y notificaciones. Para la misión de movimiento conviene estar al aire libre con GPS disponible. La prueba completa de sensores requiere un celular Android.

## Comprobaciones

- `npm run lint`
- `npm test`
- `npm run build`
- `npx cap sync android`
- Compilación Android con `gradlew assembleDebug`
