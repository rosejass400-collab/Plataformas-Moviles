import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTasks, normalizeTaskTitle } from '../src/lib/task-utils.js';

test('normaliza espacios y recorta el título', () => {
  assert.equal(normalizeTaskTitle('  Leer   la guía  '), 'Leer la guía');
  assert.equal(normalizeTaskTitle('x'.repeat(130)).length, 120);
});

test('un valor vacío produce un título vacío', () => {
  assert.equal(normalizeTaskTitle('   '), '');
  assert.equal(normalizeTaskTitle(null), '');
});

test('filtra tareas completadas y pendientes', () => {
  const tasks = [{ completada: true }, { completada: false }];
  assert.deepEqual(filterTasks(tasks, 'pendientes'), [{ completada: false }]);
  assert.deepEqual(filterTasks(tasks, 'completadas'), [{ completada: true }]);
  assert.deepEqual(filterTasks(tasks, 'todas'), tasks);
});
