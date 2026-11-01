import { useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { Motion } from '@capacitor/motion';
import { Network } from '@capacitor/network';
import { Device } from '@capacitor/device';
import { Haptics } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { distanceMeters } from '../services/geo';
import { loadTracks, saveTrack } from '../services/storage';

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function pointFromPosition(position) {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    accuracy: position.coords.accuracy,
    speed: position.coords.speed,
    time: new Date(position.timestamp || Date.now()).toISOString(),
  };
}

export function useTracking() {
  const [position, setPosition] = useState(null);
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('idle');
  const [connected, setConnected] = useState(true);
  const [connectionType, setConnectionType] = useState('unknown');
  const [message, setMessage] = useState('');
  const sessionRef = useRef(null);
  const watchRef = useRef(null);
  const motionRef = useRef(null);
  const networkRef = useRef(null);
  const timerRef = useRef(null);
  const lastMotionRef = useRef(0);
  const lastMovementRef = useRef(0);
  const lastNoticesRef = useRef({});
  const processingRef = useRef(false);
  const stoppingRef = useRef(false);
  const resumingRef = useRef(false);
  const foregroundRef = useRef(true);

  useEffect(() => {
    loadTracks().then((tracks) => {
      setHistory(tracks);
      const unfinished = tracks.find((track) => !track.endedAt);
      if (unfinished && !sessionRef.current) {
        sessionRef.current = unfinished;
        setSession(unfinished);
        setPosition(unfinished.points.at(-1) || null);
        setStatus('interrupted');
        setMessage('Recorrido recuperado. Puedes reanudarlo o detenerlo y guardarlo.');
      }
    }).catch((error) => setMessage(`No se pudo leer el historial: ${error.message}`));
    Network.getStatus().then((value) => { setConnected(value.connected); setConnectionType(value.connectionType); }).catch(() => {});
    return () => {
      if (watchRef.current) Geolocation.clearWatch({ id: watchRef.current }).catch(() => {});
      if (timerRef.current) clearInterval(timerRef.current);
      motionRef.current?.remove();
      networkRef.current?.remove();
    };
  }, []);

  async function notifyOnce(kind, title, body, cooldown = 60000) {
    const now = Date.now();
    if (now - (lastNoticesRef.current[kind] || 0) < cooldown) return;
    lastNoticesRef.current[kind] = now;
    try {
      const permission = await LocalNotifications.checkPermissions();
      if (permission.display !== 'granted') return;
      await LocalNotifications.schedule({ notifications: [{ id: now % 2147483647, title, body }] });
    } catch { /* El seguimiento sigue aunque las notificaciones no estén disponibles. */ }
  }

  async function getPosition() {
    const permission = await Geolocation.checkPermissions();
    if (permission.location !== 'granted' && permission.coarseLocation !== 'granted') {
      const requested = await Geolocation.requestPermissions();
      if (requested.location !== 'granted' && requested.coarseLocation !== 'granted') {
        throw new Error('Debes permitir la ubicación para ver el mapa y registrar el recorrido.');
      }
    }
    const result = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 20000, maximumAge: 0 });
    const point = pointFromPosition(result);
    setPosition(point);
    return point;
  }

  async function locate() {
    setMessage('');
    try { return await getPosition(); }
    catch (error) { setMessage(error.message || 'No fue posible obtener la ubicación.'); return null; }
  }

  async function stopMonitoring() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (watchRef.current) {
      const watchId = watchRef.current;
      watchRef.current = null;
      await Geolocation.clearWatch({ id: watchId }).catch(() => {});
    }
    await motionRef.current?.remove().catch(() => {});
    await networkRef.current?.remove().catch(() => {});
    motionRef.current = null;
    networkRef.current = null;
  }

  async function stop(reason = '') {
    if (stoppingRef.current || !sessionRef.current) return;
    stoppingRef.current = true;
    try {
      await stopMonitoring();
      const finalTrack = { ...sessionRef.current, endedAt: new Date().toISOString(), stopReason: reason };
      await saveTrack(finalTrack);
      setHistory(await loadTracks());
      setSession(finalTrack);
      sessionRef.current = null;
      setStatus('idle');
      setMessage(reason || 'Recorrido guardado en el historial.');
    } catch (error) {
      setMessage(`No se pudo guardar el recorrido: ${error.message}`);
    } finally {
      stoppingRef.current = false;
    }
  }

  async function handlePosition(result, error) {
    if (error) { setMessage(`GPS: ${error.message || 'No se pudo leer la posición.'}`); return; }
    if (!result || !sessionRef.current || !foregroundRef.current || processingRef.current) return;
    processingRef.current = true;
    try {
      const next = pointFromPosition(result);
      setPosition(next);
      if (next.accuracy > 60) {
        setMessage('Esperando una señal GPS más precisa.');
        return;
      }
      const battery = await Device.getBatteryInfo().catch(() => ({}));
      if (battery.batteryLevel !== undefined && battery.batteryLevel !== null && battery.batteryLevel <= 0.15 && !battery.isCharging) {
        await notifyOnce('battery', 'Seguimiento detenido', 'La batería está baja.');
        await stop('Seguimiento detenido por batería baja.');
        return;
      }
      const track = sessionRef.current;
      const previous = track.points[track.points.length - 1];
      if (track.points.length === 1 && previous.accuracy > 60) {
        const corrected = { ...track, points: [next] };
        sessionRef.current = corrected;
        setSession(corrected);
        await saveTrack(corrected);
        return;
      }
      const step = distanceMeters(previous, next);
      const moving = step >= Math.max(8, Math.min(35, (next.accuracy + previous.accuracy) / 2)) || Date.now() - lastMotionRef.current < 8000;
      if (moving) lastMovementRef.current = Date.now();
      if (!moving && Date.now() - lastMovementRef.current >= 20000) {
        setStatus('paused');
        if (Date.now() - lastMovementRef.current >= 120000) {
          await notifyOnce('still', 'Sigues en el mismo lugar', 'El recorrido se reanudará cuando vuelvas a moverte.', 120000);
        }
        return;
      }
      if (step < 5) return;
      if (step > Math.max(150, next.accuracy * 3)) return;
      const updated = { ...track, points: [...track.points, next], meters: track.meters + step };
      sessionRef.current = updated;
      setSession(updated);
      setStatus('tracking');
      await saveTrack(updated);
      const speed = next.speed ?? step / Math.max(1, (new Date(next.time) - new Date(previous.time)) / 1000);
      if (speed > 7) await notifyOnce('fast', 'Movimiento rápido', 'Vas rápido. Revisa el seguimiento cuando sea seguro.', 180000);
    } catch (caught) {
      setMessage(`No se pudo guardar un punto: ${caught.message}`);
    } finally {
      processingRef.current = false;
    }
  }

  async function startMonitoring() {
    if (!foregroundRef.current) return false;
    try {
      motionRef.current = await Motion.addListener('accel', (event) => {
        const acceleration = event.acceleration || {};
        const magnitude = Math.hypot(acceleration.x || 0, acceleration.y || 0, acceleration.z || 0);
        if (magnitude > 0.7) lastMotionRef.current = Date.now();
      });
    } catch { /* El GPS permite continuar aunque falte acelerómetro. */ }
    try {
      networkRef.current = await Network.addListener('networkStatusChange', (value) => {
        setConnected(value.connected);
        setConnectionType(value.connectionType);
        if (!value.connected) notifyOnce('offline', 'Sin conexión', 'El recorrido sigue guardándose en este dispositivo.', 180000);
      });
      const network = await Network.getStatus();
      setConnected(network.connected);
      setConnectionType(network.connectionType);
      if (!network.connected) await notifyOnce('offline', 'Sin conexión', 'El recorrido sigue guardándose en este dispositivo.', 180000);
    } catch { /* La falta de red no detiene el recorrido local. */ }
    watchRef.current = await Geolocation.watchPosition({ enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }, handlePosition);
    if (!foregroundRef.current) { await stopMonitoring(); return false; }
    timerRef.current = setInterval(async () => {
      if (!sessionRef.current || !foregroundRef.current || stoppingRef.current) return;
      const idle = Date.now() - Math.max(lastMovementRef.current, lastMotionRef.current);
      if (idle >= 20000) setStatus('paused');
      if (idle >= 120000) await notifyOnce('still', 'Sigues en el mismo lugar', 'El recorrido se reanudará cuando vuelvas a moverte.', 120000);
      const currentBattery = await Device.getBatteryInfo().catch(() => ({}));
      if (currentBattery.batteryLevel !== undefined && currentBattery.batteryLevel !== null && currentBattery.batteryLevel <= 0.15 && !currentBattery.isCharging) {
        await notifyOnce('battery', 'Seguimiento detenido', 'La batería está baja.');
        await stop('Seguimiento detenido por batería baja.');
      }
    }, 5000);
    return true;
  }

  async function start() {
    if (sessionRef.current) return;
    foregroundRef.current = true;
    setMessage('');
    try {
      const battery = await Device.getBatteryInfo().catch(() => ({}));
      if (battery.batteryLevel !== undefined && battery.batteryLevel !== null && battery.batteryLevel <= 0.15 && !battery.isCharging) {
        throw new Error('La batería está por debajo del 15 %. Cárgala antes de iniciar.');
      }
      const first = await getPosition();
      if (!foregroundRef.current) throw new Error('Regresa a la app para iniciar el recorrido.');
      const id = `${Date.now()}`;
      const track = { id, date: localDate(), startedAt: new Date().toISOString(), endedAt: null, meters: 0, points: [first], photos: [] };
      await saveTrack(track);
      sessionRef.current = track;
      setSession(track);
      setStatus('tracking');
      lastMotionRef.current = Date.now();
      lastMovementRef.current = Date.now();
      try { await LocalNotifications.requestPermissions(); } catch { /* Opcional en el navegador. */ }
      try { await Haptics.vibrate({ duration: 250 }); } catch { /* Algunos equipos no vibran. */ }
      if (!await startMonitoring()) {
        setStatus('interrupted');
        setMessage('Recorrido en pausa. Reanúdalo al volver a la app.');
      }
    } catch (error) {
      setMessage(error.message || 'No se pudo iniciar el seguimiento.');
      if (sessionRef.current) await stop('No se pudo iniciar el GPS.');
    }
  }

  async function pauseForBackground() {
    foregroundRef.current = false;
    if (!sessionRef.current) return;
    await stopMonitoring();
    setStatus('interrupted');
    setMessage('Recorrido en pausa. Reanúdalo al volver a la app.');
  }

  async function resume() {
    if (!sessionRef.current || watchRef.current || resumingRef.current) return;
    foregroundRef.current = true;
    resumingRef.current = true;
    setMessage('');
    try {
      const battery = await Device.getBatteryInfo().catch(() => ({}));
      if (battery.batteryLevel !== undefined && battery.batteryLevel !== null && battery.batteryLevel <= 0.15 && !battery.isCharging) {
        throw new Error('La batería está por debajo del 15 %. Guarda el recorrido y carga el celular.');
      }
      const current = await getPosition();
      if (!foregroundRef.current) throw new Error('El recorrido sigue en pausa. Regresa a la app para reanudarlo.');
      const track = sessionRef.current;
      const updated = {
        ...track,
        points: [...track.points, current],
        breaks: [...(track.breaks || []), track.points.length],
      };
      await saveTrack(updated);
      sessionRef.current = updated;
      setSession(updated);
      lastMotionRef.current = Date.now();
      lastMovementRef.current = Date.now();
      if (!await startMonitoring()) throw new Error('El recorrido sigue en pausa. Regresa a la app para reanudarlo.');
      setStatus('tracking');
      setMessage('Recorrido reanudado. El tramo sin seguimiento no se suma a la distancia.');
    } catch (error) {
      await stopMonitoring();
      setStatus('interrupted');
      setMessage(error.message || 'No se pudo reanudar el recorrido.');
    } finally {
      resumingRef.current = false;
    }
  }

  async function addPhoto(path, photoPosition = position) {
    const active = sessionRef.current;
    const track = active || (await loadTracks()).find((item) => !item.endedAt);
    if (!track) return;
    const updated = { ...track, photos: [...track.photos, { path, time: new Date().toISOString(), position: photoPosition }] };
    if (active) {
      sessionRef.current = updated;
      setSession(updated);
    } else {
      updated.endedAt = new Date().toISOString();
      updated.stopReason = 'La cámara interrumpió el seguimiento.';
    }
    await saveTrack(updated);
    if (!active) setHistory(await loadTracks());
  }

  return { position, session, history, status, connected, connectionType, message, setMessage, locate, start, stop, resume, pauseForBackground, addPhoto };
}
