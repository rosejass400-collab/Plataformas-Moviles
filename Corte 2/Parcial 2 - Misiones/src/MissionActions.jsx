import { useEffect, useRef, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Motion } from '@capacitor/motion';
import { IonButton, IonSpinner } from '@ionic/react';
import { completedCount, distanceMeters } from './missions.js';
import { savePhoto } from './savePhoto.js';

export default function MissionActions({ user, missionId, missions, completeMission, restoredPhoto, clearRestoredPhoto }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [distance, setDistance] = useState(0);
  const [quietSeconds, setQuietSeconds] = useState(0);
  const watchId = useRef(null);
  const motionListener = useRef(null);
  const timer = useRef(null);
  const wakeLock = useRef(null);
  const finished = useRef(false);
  const lastMovement = useRef(0);
  const lastSample = useRef(0);
  const samples = useRef(0);
  const previousVector = useRef(null);
  const startedAt = useRef(0);
  const handledRestoredPhoto = useRef(null);

  useEffect(() => () => {
    finished.current = true;
    if (watchId.current) Geolocation.clearWatch({ id: watchId.current });
    motionListener.current?.remove();
    if (timer.current) clearInterval(timer.current);
    wakeLock.current?.release();
  }, []);

  useEffect(() => {
    if (missionId !== 'photo' || !restoredPhoto || handledRestoredPhoto.current === restoredPhoto) return;
    handledRestoredPhoto.current = restoredPhoto;
    setBusy(true);
    (async () => {
      try {
        if (!restoredPhoto.success) throw new Error(restoredPhoto.error?.message || 'No se recuperó la foto.');
        const result = await storeAndCompletePhoto(user.uid, restoredPhoto.data, completeMission);
        if (result.changed) {
          setMessage('Misión completada. Tus puntos se guardaron.');
          await notifyCompletion(result.missions);
        }
      } catch (error) {
        setMessage(error.message || 'No se pudo guardar la foto.');
      } finally {
        setBusy(false);
        clearRestoredPhoto();
      }
    })();
  }, [missionId, restoredPhoto, user.uid, completeMission, clearRestoredPhoto]);

  async function finishMission(id) {
    const result = await completeMission(id);
    if (result.changed) {
      setMessage('Misión completada. Tus puntos se guardaron.');
      await notifyCompletion(result.missions);
    }
  }

  async function takePhoto() {
    setBusy(true);
    setMessage('');
    try {
      const photo = await Camera.getPhoto({
        quality: 75,
        width: 1280,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });
      const result = await storeAndCompletePhoto(user.uid, photo, completeMission);
      if (result.changed) {
        setMessage('Misión completada. Tus puntos se guardaron.');
        await notifyCompletion(result.missions);
      }
    } catch (error) {
      setMessage(error.message || 'No se pudo guardar la foto.');
    } finally {
      setBusy(false);
    }
  }

  async function stopLocation() {
    finished.current = true;
    const id = watchId.current;
    watchId.current = null;
    if (id) {
      try { await Geolocation.clearWatch({ id }); } catch { /* El seguimiento ya terminó. */ }
    }
    setBusy(false);
  }

  async function startMovement() {
    setBusy(true);
    setMessage('Buscando una ubicación precisa…');
    setDistance(0);
    finished.current = false;
    let qualifyingPositions = 0;
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location !== 'granted') throw new Error('Activa la ubicación precisa para esta misión.');
      const start = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 0, timeout: 20000 });
      if (start.coords.accuracy > 30) throw new Error('La ubicación inicial es imprecisa. Inténtalo al aire libre.');
      setMessage('Camina hasta alejarte 50 metros del punto inicial.');

      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: true, maximumAge: 0, timeout: 20000, minimumUpdateInterval: 1000 },
        async (position, error) => {
          if (finished.current) return;
          if (error) {
            setMessage('No se pudo seguir la ubicación. Inténtalo de nuevo.');
            await stopLocation();
            return;
          }
          if (!position || position.coords.accuracy > 30) {
            setMessage('Esperando una ubicación más precisa…');
            return;
          }
          const meters = distanceMeters(start.coords, position.coords);
          setDistance(Math.round(meters));
          if (meters > 30 && meters < 50) setMessage('Movimiento detectado. Continúa hasta 50 metros.');
          if (meters >= 50) {
            qualifyingPositions += 1;
            if (qualifyingPositions < 2) {
              setMessage('Confirmando la distancia con otra lectura GPS…');
              return;
            }
            finished.current = true;
            await stopLocation();
            try {
              await finishMission('movement');
            } catch (saveError) {
              setMessage(saveError.message || 'No se pudieron guardar los puntos.');
            }
          } else {
            qualifyingPositions = 0;
          }
        },
      );
      if (finished.current) {
        try { await Geolocation.clearWatch({ id }); } catch { /* El seguimiento ya terminó. */ }
      }
      else watchId.current = id;
    } catch (error) {
      setMessage(error.message || 'No se pudo iniciar la ubicación.');
      await stopLocation();
    }
  }

  async function stopQuiet() {
    finished.current = true;
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    if (motionListener.current) await motionListener.current.remove();
    motionListener.current = null;
    if (wakeLock.current) {
      try { await wakeLock.current.release(); } catch { /* La pantalla ya se liberó. */ }
    }
    wakeLock.current = null;
    setBusy(false);
  }

  async function startQuiet() {
    setBusy(true);
    setMessage('Mantén el celular quieto durante 10 segundos.');
    setQuietSeconds(0);
    finished.current = false;
    samples.current = 0;
    lastSample.current = 0;
    lastMovement.current = Date.now();
    startedAt.current = lastMovement.current;
    previousVector.current = null;
    try {
      if (navigator.wakeLock?.request) {
        try { wakeLock.current = await navigator.wakeLock.request('screen'); } catch { /* Puede no estar disponible. */ }
      }
      motionListener.current = await Motion.addListener('accel', (event) => {
        const acceleration = event.acceleration;
        const vector = acceleration || event.accelerationIncludingGravity;
        if (!vector || [vector.x, vector.y, vector.z].some((value) => !Number.isFinite(value))) return;
        const size = Math.hypot(vector.x, vector.y, vector.z);
        const previous = previousVector.current;
        const change = previous ? Math.hypot(vector.x - previous.x, vector.y - previous.y, vector.z - previous.z) : 0;
        const moving = acceleration ? size > 0.75 : change > 0.75;
        if (moving) lastMovement.current = Date.now();
        previousVector.current = vector;
        lastSample.current = Date.now();
        samples.current += 1;
      });
      if (finished.current) {
        await motionListener.current.remove();
        motionListener.current = null;
        return;
      }

      timer.current = setInterval(async () => {
        if (finished.current) return;
        const now = Date.now();
        if (!samples.current && now - startedAt.current > 5000) {
          await stopQuiet();
          setMessage('Este dispositivo no entrega datos del acelerómetro.');
          return;
        }
        if (document.visibilityState !== 'visible' || now - lastSample.current > 1500 || samples.current < 5) {
          lastMovement.current = now;
          setQuietSeconds(0);
          return;
        }
        const seconds = Math.min(10, Math.floor((now - lastMovement.current) / 1000));
        setQuietSeconds(seconds);
        if (seconds < 10) return;
        finished.current = true;
        await stopQuiet();
        try {
          await Haptics.vibrate({ duration: 500 });
          await finishMission('still');
        } catch (error) {
          setMessage(error.message || 'No se pudo completar la misión.');
        }
      }, 250);
    } catch (error) {
      setMessage(error.message || 'No se pudo iniciar el acelerómetro.');
      await stopQuiet();
    }
  }

  if (missions[missionId]) return <p className="status done">Completada</p>;
  if (missionId === 'still' && !missions.movement) return <p className="status">Bloqueada hasta recorrer 50 metros.</p>;

  return (
    <div className="mission-action">
      {missionId === 'photo' && <IonButton onClick={takePhoto} disabled={busy}>Tomar y guardar foto</IonButton>}
      {missionId === 'movement' && (busy
        ? <IonButton fill="outline" onClick={stopLocation}>Detener seguimiento</IonButton>
        : <IonButton onClick={startMovement}>Iniciar recorrido</IonButton>)}
      {missionId === 'movement' && busy && <p className="status">Distancia desde el inicio: {distance} m</p>}
      {missionId === 'still' && (busy
        ? <IonButton fill="outline" onClick={stopQuiet}>Detener temporizador</IonButton>
        : <IonButton onClick={startQuiet}>Iniciar 10 segundos</IonButton>)}
      {missionId === 'still' && busy && <p className="status">Quieto: {quietSeconds} / 10 s</p>}
      {busy && missionId === 'photo' && <IonSpinner name="dots" />}
      {message && <p className="status" role="status">{message}</p>}
    </div>
  );
}

async function notifyCompletion(missions) {
  try {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') return;
    const now = Date.now() % 1000000000;
    const notifications = [{
      id: now,
      title: 'Misiones',
      body: 'Has completado una misión',
    }];
    if (completedCount(missions) === 2) {
      notifications.push({ id: now + 1, title: 'Misiones', body: 'Te falta 1 misión para completar' });
    }
    await LocalNotifications.schedule({ notifications });
  } catch {
    // Un permiso de notificaciones denegado no quita los puntos obtenidos.
  }
}

async function storeAndCompletePhoto(uid, photo, completeMission) {
  if (!photo?.base64String) throw new Error('No se recibió la imagen de la cámara.');
  await savePhoto(uid, photo.base64String, photo.format || 'jpeg');
  return completeMission('photo');
}
