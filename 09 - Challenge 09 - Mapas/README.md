# Challenge 09 · Mapas y sensores

Aplicación Ionic + React + Capacitor para registrar recorridos con GPS y verlos en un mapa de OpenStreetMap.

## Funciones

- Ubicación actual al abrir la app y estado de conexión Wi-Fi/datos.
- Registro de trayectos con pausa automática al estar quieto y reanudación al moverse.
- Vibración al iniciar y parada al bajar del 15 % de batería.
- Avisos locales por falta de conexión, quietud prolongada o movimiento rápido.
- Archivo JSON privado por recorrido y pantalla de historial por fecha.
- Foto de cámara con coordenadas y fecha sobreimpresas.
- Búsqueda de lugares con OpenCage, ordenados por distancia cuando se configura una clave.

## Ejecutar

Requiere Node.js y Android Studio para compilar en Android.

```bash
npm install
npm run dev
```

Para Android:

```bash
npm run build
npx cap sync android
npx cap open android
```

El GPS, la vibración, la cámara y las notificaciones se usan desde el dispositivo Android. El seguimiento funciona con la app abierta.
Al abrir la app se solicita ubicación y el mapa se centra en la posición obtenida. Si se cancela la cámara con Atrás, no se guarda ninguna foto.

## OpenCage

La consulta de lugares necesita una clave de la API de OpenCage. Se introduce en el campo de la app y se guarda únicamente en el almacenamiento local de ese dispositivo. No se incluye una clave en este repositorio ni en el APK. La API de geocodificación permite búsquedas por nombre con un límite geográfico alrededor de la posición actual; no es un catálogo exhaustivo de comercios.

## Archivos de recorridos

Cada recorrido se guarda como `recorridos/AAAA-MM-DD/ID.json` en el directorio privado de la aplicación. La pantalla Historial lee esos archivos y dibuja la ruta. Las fotos se guardan en `fotos/` dentro del mismo directorio privado.
