export function money(value) {
  return `$${Number(value || 0).toLocaleString('es-CO')}`;
}

export function shortName(user) {
  return user?.displayName?.trim().split(/\s+/)[0] || user?.email?.split('@')[0] || 'amigo';
}
