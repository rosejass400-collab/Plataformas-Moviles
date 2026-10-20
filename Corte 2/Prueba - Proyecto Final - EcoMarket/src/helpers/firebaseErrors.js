const messages = {
  'auth/email-already-in-use': 'Ese correo ya tiene una cuenta. Usa Iniciar sesión.',
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'Escribe un correo válido.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/user-not-found': 'No encontramos una cuenta con ese correo. Crea una cuenta primero.',
  'auth/wrong-password': 'Contraseña incorrecta.',
  'auth/network-request-failed': 'Sin conexión con Firebase. Revisa internet e intenta de nuevo.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento y vuelve a intentarlo.',
  'auth/operation-not-allowed': 'Habilita el proveedor Anónimo en Firebase Authentication → Sign-in method para el modo de prueba.',
  'auth/unauthorized-domain': 'Añade localhost a los dominios autorizados en Firebase Authentication.'
};
export function explainFirebaseError(error) {
  return messages[error?.code] || (error?.code === 'auth/internal-error' || error?.code === 'auth/service-is-currently-unavailable'
    ? 'Firebase no está disponible temporalmente. Comprueba internet; si persiste, revisa que la clave web de Firebase no tenga restricciones incompatibles con la app Android.'
    : `No se pudo completar la operación (${error?.code || 'error'}).`);
}
