# Proyecto Final - EcoMarket

EcoMarket es una aplicación móvil para explorar productos locales, preparar una canasta y registrar pedidos. Incluye cuenta con correo y contraseña, direcciones, mapa, conversación en tiempo real y panel para administrar pedidos y productos.

## Enlaces e integrantes

- Prototipo en Lovable: [EcoMarket Fresh Finds](https://lovable.dev/projects/77e888ce-35e6-42de-8498-06fb11555892)
- Código: [Plataformas-Moviles](https://github.com/rosejass400-collab/Plataformas-Moviles/tree/main/Proyecto%20Final%20-%20EcoMarket)
- Integrante: Jasson Rosero
- Rama de desarrollo: `proyecto-final-ecomarket`, integrada a `main` para la entrega.

## Pantallas

Inicio, catálogo, detalle de producto, carrito, mapa de puntos de referencia, chat, perfil, pedidos, direcciones y panel de administración. El diseño utiliza la paleta, imágenes y composición del prototipo de Lovable.

## Tecnologías y servicios consumidos

| Uso | Tecnología / API |
| --- | --- |
| Interfaz y navegación | React, Ionic React, React Router, Sass Modules |
| Aplicación Android | Capacitor |
| Registro e inicio de sesión | Firebase Authentication, proveedor correo/contraseña |
| Productos, pedidos, usuarios y chat en tiempo real | Cloud Firestore |
| Mapa base | OpenStreetMap Tiles (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) y Leaflet |
| Ubicación y cámara | Capacitor Geolocation y Camera |
| Respuesta táctil y aviso de pedido | Capacitor Haptics y Local Notifications |
| Persistencia local de canasta y foto de perfil | `localStorage` |

Las reglas de Firestore están en [`firestore.rules`](firestore.rules). Los pedidos y mensajes solo son accesibles para su dueño o una cuenta administradora. La cuenta administradora requiere un documento `admins/{uid}` creado desde Firebase Console; la app no puede concederse ese permiso a sí misma.

## Ejecución local

1. Instalar Node.js y Android Studio para compilar Android.
2. Copiar `.env.example` a `.env` y completar la configuración web del proyecto Firebase.
3. En Firebase Authentication, habilitar **Correo electrónico/contraseña**. En Cloud Firestore, publicar las reglas de `firestore.rules`.
4. Ejecutar `npm install`, `npm run dev` para la versión web y `npm run build` para compilar.
5. Para Android, ejecutar `npx cap sync android` y `cd android && .\gradlew.bat assembleDebug`. El APK se genera en `android/app/build/outputs/apk/debug/`.

Los archivos `.env`, `google-services.json`, compilaciones y certificados no se suben a Git.

## Alcance de la entrega

El catálogo inicial usa contenido del prototipo; un administrador puede añadir productos en Firestore. El mapa muestra puntos de referencia, no tiendas verificadas. La confirmación registra un pedido para demostración académica; no procesa pagos ni coordina entregas reales. La foto de perfil permanece en el dispositivo. La descripción completa y las pruebas están en [`docs/alcance-tecnologias.md`](docs/alcance-tecnologias.md).
