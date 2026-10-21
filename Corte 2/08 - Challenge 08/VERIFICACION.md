# Comprobaciones del Challenge 08

## Realizadas

- Registro y acceso: el usuario creó y confirmó su cuenta y abrió el tablero.
- Supabase Auth respondió correctamente con registro y confirmación por correo habilitados.
- Una consulta sin sesión a `tareas` recibió HTTP 401 / permiso denegado, como se esperaba.
- Crear, consultar, editar título, marcar completada y eliminar una tarea temporal desde la interfaz.
- Sincronización de creación, edición y eliminación entre dos ventanas con la misma sesión. Se corrigió el filtro que impedía recibir borrados.
- El usuario cargó una foto; la imagen se mostró en su perfil mediante enlace firmado.
- Tres pruebas unitarias aprobadas; lint sin errores; compilación web y sincronización de Capacitor exitosas.
- La comparación con la versión base no muestra cambios en Challenge 07.

- Compilación publicada en Netlify y reclamada en la cuenta del usuario: https://challenge08-jasson-rosero.netlify.app/.

## Pendientes o límites

- Prueba con dos cuentas distintas para comprobar aislamiento de tareas y archivos en vivo. Las políticas están definidas en SQL y el acceso sin sesión ya se comprobó.
- Captura física con cámara y ejecución en Android: requieren dispositivo/permisos. La selección y carga de imagen en navegador sí se comprobó.
- Prueba de confirmación de correo desde el origen publicado; hay que configurar Site URL en Supabase.
- Subida de los últimos cambios e integración de la rama en `main`.

La compilación informa un aviso por tamaño del archivo JavaScript principal. No impide generar la app.
