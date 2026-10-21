export function normalizeTaskTitle(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 120);
}

export function filterTasks(tasks, filter) {
  if (filter === 'pendientes') return tasks.filter((task) => !task.completada);
  if (filter === 'completadas') return tasks.filter((task) => task.completada);
  return tasks;
}
