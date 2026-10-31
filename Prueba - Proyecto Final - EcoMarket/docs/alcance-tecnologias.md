# Alcance y tecnologÃ­as

## Alcance
EcoMarket permite a usuarios consultar productos sostenibles, mantener un carrito persistente, autenticarse, registrar pedidos, ubicarse en un mapa y conversar con soporte en tiempo real. Incluye un panel para consultar pedidos y herramientas nativas del dispositivo.

## TecnologÃ­as
React, Ionic, Vite, Capacitor, Firebase Authentication, Cloud Firestore, Firebase Cloud Messaging, Leaflet, OpenStreetMap y plugins Capacitor de cÃ¡mara, geolocalizaciÃ³n, hÃ¡pticos, dispositivo y notificaciones locales.

## Arquitectura
- `context`: estado global de autenticaciÃ³n y carrito.
- `services`: acceso a pedidos y chat de Firestore.
- `pages`, `components`, `hooks`, `routes`, `helpers/data`: interfaz y lÃ³gica modular.
- Datos locales para catÃ¡logo inicial y Firestore para usuarios, pedidos y mensajes.

## Pruebas previstas
Registro/login, carrito y pedido, mensajes en dos sesiones, permiso de ubicaciÃ³n, cÃ¡mara, hÃ¡pticos, informaciÃ³n de dispositivo y notificaciÃ³n local.