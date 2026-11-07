# Challenge 09 · GIPHY

Buscador de GIFs para Android hecho con Ionic, React y Capacitor. Consulta la API de búsqueda de GIPHY con `fetch` y muestra 25 resultados por búsqueda.

## Preparación

1. Crea una aplicación de tipo API en el panel de [GIPHY Developers](https://developers.giphy.com/).
2. Copia `.env.example` como `.env` y reemplaza el valor de `VITE_GIPHY_API_KEY` por la clave beta de esa aplicación.
3. Instala las dependencias y ejecuta la app:

```bash
npm install
npm run dev
```

La búsqueda se hace desde el cliente con `q`, `limit=25`, `offset=0`, `rating=g` y `lang=es`. La app comprueba el estado HTTP, muestra errores y cancela la consulta anterior cuando se inicia otra búsqueda. `.env` se mantiene fuera de Git. Al compilar para Android, Vite incorpora la clave de cliente en el APK.

## Android

```bash
npm run build
npx cap sync android
npx cap open android
```

Se necesita conexión a Internet para buscar y mostrar los GIFs.
