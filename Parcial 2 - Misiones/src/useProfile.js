import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.js';
import { calculatePoints, EMPTY_MISSIONS, localKey, missionList, missionState } from './missions.js';

function blankProfile(name) {
  return {
    displayName: name,
    points: 0,
    missions: missionList(EMPTY_MISSIONS),
    updatedAt: serverTimestamp(),
  };
}

export async function createProfile(user, name) {
  const reference = doc(db, 'profiles', user.uid);
  await runTransaction(db, async (transaction) => {
    const current = await transaction.get(reference);
    if (current.exists()) {
      transaction.update(reference, {
        displayName: name,
        missions: missionList(current.data().missions),
        updatedAt: serverTimestamp(),
      });
    } else {
      transaction.set(reference, blankProfile(name));
    }
  });
}

export function useProfile(user) {
  const [profile, setProfile] = useState(() => readLocalProfile(user.uid));
  const [ranking, setRanking] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const key = localKey(user.uid);
    let stopProfile;
    let stopRanking;
    let active = true;

    const reference = doc(db, 'profiles', user.uid);
    stopProfile = onSnapshot(reference, (snapshot) => {
      if (!active || !snapshot.exists()) return;
      const value = snapshot.data();
      const state = missionState(value.missions);
      const next = {
        displayName: value.displayName,
        points: calculatePoints(state),
        missions: state,
      };
      localStorage.setItem(key, JSON.stringify({ points: next.points, missions: missionList(state) }));
      setProfile(next);
      setError('');
    }, () => setError('No se pudo leer el progreso en Firebase.'));

    stopRanking = onSnapshot(collection(db, 'profiles'), (snapshot) => {
      if (!active) return;
      const players = snapshot.docs.map((entry) => ({
        uid: entry.id,
        displayName: entry.data().displayName,
        points: entry.data().points,
      }));
      players.sort((a, b) => b.points - a.points || a.displayName.localeCompare(b.displayName));
      setRanking(players);
    }, () => setError('No se pudo cargar el ranking.'));

    createProfileIfMissing(user).catch(() => {
      if (active) setError('No se pudo crear tu perfil en Firebase.');
    });

    return () => {
      active = false;
      stopProfile?.();
      stopRanking?.();
    };
  }, [user]);

  async function completeMission(id) {
    const reference = doc(db, 'profiles', user.uid);
    const result = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(reference);
      if (!snapshot.exists()) throw new Error('Tu perfil todavía no está listo. Intenta de nuevo.');
      const current = snapshot.data();
      const currentMissions = missionState(current.missions);
      if (currentMissions[id]) return { changed: false, missions: currentMissions };
      if (id === 'still' && !currentMissions.movement) {
        throw new Error('Primero debes completar la misión de movimiento.');
      }
      const missions = { ...currentMissions, [id]: true };
      transaction.update(reference, {
        missions: missionList(missions),
        points: calculatePoints(missions),
        updatedAt: serverTimestamp(),
      });
      return { changed: true, missions };
    });

    if (result.changed) {
      const next = { points: calculatePoints(result.missions), missions: result.missions };
      localStorage.setItem(localKey(user.uid), JSON.stringify({
        points: next.points,
        missions: missionList(next.missions),
      }));
      setProfile((current) => ({ ...current, ...next }));
    }
    return result;
  }

  return { profile, ranking, error, completeMission };
}

function readLocalProfile(uid) {
  const key = localKey(uid);
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return saved?.missions ? { ...saved, missions: missionState(saved.missions) } : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

async function createProfileIfMissing(user) {
  const reference = doc(db, 'profiles', user.uid);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists()) {
      const name = user.displayName || user.email?.split('@')[0] || 'Usuario';
      transaction.set(reference, blankProfile(name));
    } else if (!Array.isArray(snapshot.data().missions)) {
      transaction.update(reference, {
        missions: missionList(snapshot.data().missions),
        updatedAt: serverTimestamp(),
      });
    }
  });
}
