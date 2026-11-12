# Alcance y tecnologías de EcoMarket

## Objetivo

EcoMarket acerca productos de productores locales a compradores mediante una aplicación móvil. El usuario consulta un catálogo, revisa los detalles, guarda productos en el carrito, registra un pedido y puede conversar con soporte. El diseño sigue el prototipo EcoMarket Fresh Finds creado en Lovable.

## Funciones desarrolladas

- Registro e inicio de sesión reales con Firebase Authentication y correo/contraseña.
- Inicio con categorías, búsqueda y catálogo con imágenes, origen y precio. Detalle con selector de cantidad.
- Carrito persistido localmente, cálculo de subtotal y envío, dirección de entrega y pedido guardado con una transacción de Firestore.
- Historial de pedidos y direcciones por usuario.
- Chat de usuario y respuesta del administrador sincronizados con Firestore en tiempo real.
- Mapa con ubicación actual del dispositivo y puntos EcoMarket de referencia en Bogotá.
- Panel de administración para consultar pedidos, actualizar su estado, agregar productos y responder conversaciones.
- Cámara para foto de perfil guardada en el teléfono, respuesta háptica al agregar productos y aviso local al registrar un pedido.

## Estructura

| Carpeta | Responsabilidad |
| --- | --- |
| `src/pages` | Pantallas de la app. Inicio, catálogo, producto, carrito, mapa, chat, perfil y administración. |
| `src/components` | Tarjetas de producto, navegación y encabezado compartidos. |
| `src/context` | Autenticación y estado del carrito. |
| `src/hooks` | Acceso al estado y suscripción de productos. |
| `src/routes` | Rutas generales, protegidas para usuarios y protegidas para administradores. |
| `src/services` | Pedidos y mensajes en Cloud Firestore. |
| `src/helpers` | Formato y mensajes de error. |

## Datos y seguridad

Firebase Authentication identifica a cada usuario. Firestore almacena `users/{uid}`, `orders/{id}`, `chats/{uid}/messages/{id}` y `products/{id}`. Las reglas publicadas desde `firestore.rules` restringen pedidos y conversaciones al dueño o administrador. Solo un administrador puede modificar el catálogo y el estado de pedidos. La existencia de `admins/{uid}` se gestiona desde Firebase Console; no se concede desde la aplicación.

El carrito y la foto de perfil se guardan en el almacenamiento local del dispositivo. El proyecto incluye `.env.example` sin claves. La configuración web de Firebase se guarda localmente en `.env`; no hay claves de servicio en el cliente.

## Límites del prototipo

Los productos iniciales y los puntos de mapa son contenido de demostración. El importe de envío es una estimación fija y no existe pasarela de pago ni conexión con operadores de entrega. La transacción registra el pedido en Firestore; no descuenta existencias ni cobra dinero. La foto de perfil no se comparte entre dispositivos. Las notificaciones locales confirman el registro de un pedido, sin seguimiento de entrega remoto.

## Comprobación

- `npm run lint`: análisis estático de la interfaz.
- `npm run build`: compilación web de producción.
- `npx cap sync android` y `gradlew assembleDebug`: preparación y compilación del APK.
- Revisión visual de inicio, catálogo, filtro por categoría, carrito y acceso en tamaño de pantalla móvil.
- Prueba funcional en navegador con una cuenta real del usuario: inicio de sesión, envío y persistencia del chat, registro de un pedido de prueba sin entrega y lectura del pedido en el historial.
- La cámara, la ubicación y las notificaciones se integran con Capacitor; su funcionamiento en Android se debe comprobar al instalar el APK, porque los permisos y sensores no se reproducen por completo en el navegador.
