export const MISSIONS = [
  { id: 'photo', title: 'Tomar foto', points: 30, detail: 'Guarda una foto tomada con la cámara.' },
  { id: 'movement', title: 'Moverse 50 metros', points: 50, detail: 'Registra un recorrido real desde tu posición inicial.' },
  { id: 'still', title: 'Quieto 10 segundos', points: 40, detail: 'Se habilita después de recorrer 50 metros.' },
];

export const EMPTY_MISSIONS = { photo: false, movement: false, still: false };

export function missionState(value) {
  if (Array.isArray(value)) {
    return Object.fromEntries(MISSIONS.map((mission, index) => [
      mission.id,
      value[index]?.id === index + 1 && value[index]?.completed === true,
    ]));
  }
  return Object.fromEntries(MISSIONS.map((mission) => [mission.id, value?.[mission.id] === true]));
}

export function missionList(value) {
  const state = missionState(value);
  return MISSIONS.map((mission, index) => ({ id: index + 1, completed: state[mission.id] }));
}

export function calculatePoints(missions) {
  const state = missionState(missions);
  return MISSIONS.reduce((total, mission) => total + (state[mission.id] ? mission.points : 0), 0);
}

export function completedCount(missions) {
  const state = missionState(missions);
  return MISSIONS.filter((mission) => state[mission.id]).length;
}

export function distanceMeters(from, to) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const earthRadius = 6371000;
  const latitudeDifference = radians(to.latitude - from.latitude);
  const longitudeDifference = radians(to.longitude - from.longitude);
  const value =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(radians(from.latitude)) *
      Math.cos(radians(to.latitude)) *
      Math.sin(longitudeDifference / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

export function localKey(uid) {
  return `parcial2-misiones-${uid}`;
}
