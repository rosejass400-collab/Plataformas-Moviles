# EcoMarket

Aplicación móvil de comercio sostenible desarrollada con Ionic, React y Capacitor. Permite explorar productos locales, agregar artículos al carrito, iniciar sesión, registrar pedidos y comunicarse con soporte mediante chat en tiempo real.

## Enlaces
- Prototipo Lovable: https://lovable.dev/projects/77e888ce-35e6-42de-8498-06fb11555892
- Repositorio: https://github.com/rosejass400-collab/Plataformas-Moviles

## Tecnologías
- Ionic React, Vite y Capacitor
- Firebase Authentication y Cloud Firestore
- Firebase Cloud Messaging para notificaciones push
- Leaflet y OpenStreetMap para mapas
- Plugins Capacitor: Camera, Geolocation, Haptics, Motion, Device y Local Notifications

## Configuración local
1. Copiar `.env.example` a `.env` y completar la configuración web de Firebase.
2. Guardar `google-services.json` en `android/app/`.
3. Ejecutar `pnpm install`, `pnpm build` y `npx cap sync android`.

Los archivos `.env`, `google-services.json`, certificados y configuraciones locales de Android no se versionan.