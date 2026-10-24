import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePoints, completedCount, distanceMeters, EMPTY_MISSIONS, missionList, missionState } from './missions.js';

test('las tres misiones completadas suman 120 puntos', () => {
  const all = { photo: true, movement: true, still: true };
  assert.equal(calculatePoints(all), 120);
  assert.equal(completedCount(all), 3);
  assert.equal(calculatePoints(EMPTY_MISSIONS), 0);
  assert.deepEqual(missionList(all), [
    { id: 1, completed: true },
    { id: 2, completed: true },
    { id: 3, completed: true },
  ]);
  assert.deepEqual(missionState(missionList(all)), all);
});

test('la distancia GPS distingue 30 de 50 metros', () => {
  const origin = { latitude: 0, longitude: 0 };
  const thirty = distanceMeters(origin, { latitude: 0, longitude: 0.00027 });
  const fifty = distanceMeters(origin, { latitude: 0, longitude: 0.00045 });
  assert.ok(thirty > 29 && thirty < 31);
  assert.ok(fifty > 49 && fifty < 51);
});
