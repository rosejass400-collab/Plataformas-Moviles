import { useEffect, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import {
  IonApp, IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonContent, IonHeader, IonInput, IonItem, IonLabel, IonSegment, IonSegmentButton,
  IonText, IonTitle, IonToolbar,
} from '@ionic/react';
import MapPanel from './components/MapPanel';
import HistoryPanel from './components/HistoryPanel';
import { useTracking } from './hooks/useTracking';
import { formatDistance } from './services/geo';
import { findNearby, lookupPlace } from './services/places';
import { takeWatermarkedPhoto, watermarkPhotoResult } from './services/photo';
import { savePhoto } from './services/storage';

const STATUS = { idle: 'Sin seguimiento', tracking: 'Registrando', paused: 'Pausa por quietud' };

export default function App() {
  const tracking = useTracking();
  const trackingRef = useRef(tracking);
  useEffect(() => { trackingRef.current = tracking; }, [tracking]);
  const autoLocateStartedRef = useRef(false);
  const [locating, setLocating] = useState(true);
  const [page, setPage] = useState('map');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('opencageKey') || '');
  const [search, setSearch] = useState('parque');
  const [address, setAddress] = useState('');
  const [places, setPlaces] = useState([]);
  const [photo, setPhoto] = useState('');
  const [busy, setBusy] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (autoLocateStartedRef.current) return;
    autoLocateStartedRef.current = true;
    tracking.locate().finally(() => setLocating(false));
  }, [tracking]);

  useEffect(() => {
    const listener = CapacitorApp.addListener('appRestoredResult', async (event) => {
      if (event.pluginId !== 'Camera' || event.methodName !== 'getPhoto' || !event.data) return;
      const stored = localStorage.getItem('pendingPhotoPosition');
      localStorage.removeItem('pendingPhotoPosition');
      if (!stored) return;
      try {
        const photoPosition = JSON.parse(stored);
        const data = await watermarkPhotoResult(event.data, photoPosition);
        const path = await savePhoto(data, Date.now());
        setPhoto(data);
        await trackingRef.current.addPhoto(path, photoPosition);
        setNotice('Foto guardada con sus coordenadas.');
      } catch (error) { setNotice(`No se pudo recuperar la foto: ${error.message}`); }
    });
    return () => { listener.then((handle) => handle.remove()); };
  }, []);

  async function capture() {
    setBusy('photo');
    setNotice('');
    try {
      const position = tracking.position || await tracking.locate();
      if (!position) return;
      const data = await takeWatermarkedPhoto(position);
      const path = await savePhoto(data, Date.now());
      setPhoto(data);
      await tracking.addPhoto(path);
      setNotice('Foto guardada con ubicación y fecha.');
    } catch (error) {
      localStorage.removeItem('pendingPhotoPosition');
      const detail = error?.message || String(error);
      setNotice(/cancel|no image picked/i.test(detail) ? 'Foto cancelada.' : `No se pudo guardar la foto: ${detail}`);
    } finally { setBusy(''); }
  }

  async function searchPlaces() {
    setBusy('places');
    setNotice('');
    try {
      if (!apiKey.trim()) throw new Error('Ingresa una clave de OpenCage para consultar lugares.');
      const position = tracking.position || await tracking.locate();
      if (!position) return;
      if (!tracking.connected) throw new Error('Se necesita conexión para consultar OpenCage.');
      localStorage.setItem('opencageKey', apiKey.trim());
      const placeAddress = await lookupPlace(position, apiKey.trim());
      await new Promise((resolve) => setTimeout(resolve, 1100));
      const nearest = await findNearby(position, apiKey.trim(), search.trim() || 'parque');
      setAddress(placeAddress);
      setPlaces(nearest);
      if (!nearest.length) setNotice('No se encontraron lugares de ese tipo cerca. Prueba un nombre específico.');
    } catch (error) { setNotice(`OpenCage: ${error.message}`); }
    finally { setBusy(''); }
  }

  return (
    <IonApp>
      <IonHeader><IonToolbar className="topbar"><IonTitle>Rutas <span>· Challenge 09</span></IonTitle></IonToolbar></IonHeader>
      <IonContent>
        <main className="layout">
          <div className="intro">
            <div><p className="eyebrow">MAPAS Y SENSORES</p><h1>Mi recorrido</h1><p>Ubica, registra y revisa tus trayectos desde el celular.</p></div>
            <div className="status-stack"><IonBadge color={tracking.status === 'tracking' ? 'success' : 'medium'}>{STATUS[tracking.status]}</IonBadge><span>{tracking.connected ? (tracking.connectionType === 'wifi' ? 'Wi-Fi' : 'Con conexión') : 'Sin conexión'}</span></div>
          </div>
          <IonSegment value={page} onIonChange={(event) => setPage(event.detail.value)}><IonSegmentButton value="map"><IonLabel>Mapa</IonLabel></IonSegmentButton><IonSegmentButton value="history"><IonLabel>Historial</IonLabel></IonSegmentButton></IonSegment>
          {tracking.message && <p className="message">{tracking.message}</p>}
          {notice && <p className="message">{notice}</p>}
          {page === 'map' ? <div className="stack">
            <IonCard className="panel map-card"><IonCardHeader><IonCardTitle>Ubicación actual</IonCardTitle></IonCardHeader><IonCardContent>
              <MapPanel position={tracking.position} points={tracking.status === 'idle' ? [] : tracking.session?.points || []} places={places} />
              <div className="map-foot"><span>{tracking.position ? `${tracking.position.lat.toFixed(6)}, ${tracking.position.lng.toFixed(6)}` : locating ? 'Buscando tu ubicación…' : 'Pulsa «Ubicarme» para reintentar'}</span><span>{tracking.position ? `Precisión ${formatDistance(tracking.position.accuracy)}` : ''}</span></div>
            </IonCardContent></IonCard>
            <div className="two-col">
              <IonCard className="panel"><IonCardHeader><IonCardTitle>Seguimiento</IonCardTitle></IonCardHeader><IonCardContent>
                <p>El recorrido se pausa si permaneces quieto y continúa al moverte. Se detiene si la batería baja del 15 %.</p>
                <div className="stats"><strong>{formatDistance(tracking.status === 'idle' ? 0 : tracking.session?.meters || 0)}</strong><span>{tracking.status === 'idle' ? 0 : tracking.session?.points.length || 0} puntos GPS</span></div>
                <div className="actions"><IonButton fill="outline" onClick={tracking.locate}>Ubicarme</IonButton>{tracking.status === 'idle' ? <IonButton onClick={tracking.start}>Iniciar recorrido</IonButton> : <IonButton color="danger" onClick={() => tracking.stop()}>Detener y guardar</IonButton>}</div>
              </IonCardContent></IonCard>
              <IonCard className="panel"><IonCardHeader><IonCardTitle>Foto con ubicación</IonCardTitle></IonCardHeader><IonCardContent>
                <p>La cámara agrega las coordenadas y la fecha sobre la imagen. Para cancelar, usa Atrás en el celular.</p>
                <IonButton fill="outline" disabled={busy === 'photo'} onClick={capture}>{busy === 'photo' ? 'Abriendo cámara…' : 'Tomar foto'}</IonButton>
                {photo && <img className="captured-photo" src={photo} alt="Foto con coordenadas" />}
              </IonCardContent></IonCard>
            </div>
            <IonCard className="panel"><IonCardHeader><IonCardTitle>Dirección y lugares cercanos</IonCardTitle></IonCardHeader><IonCardContent>
              <p>Consulta OpenCage con una clave propia. La clave queda guardada solo en este dispositivo.</p>
              <IonItem lines="none"><IonInput label="Clave OpenCage" labelPlacement="stacked" type="password" value={apiKey} placeholder="Pega tu clave aquí" onIonInput={(event) => { const value = event.detail.value || ''; setApiKey(value); localStorage.setItem('opencageKey', value); }} /></IonItem>
              <IonItem lines="none"><IonInput label="Lugar que buscas" labelPlacement="stacked" value={search} placeholder="Ej. parque o farmacia" onIonInput={(event) => setSearch(event.detail.value || '')} /></IonItem>
              <IonButton disabled={busy === 'places' || !apiKey.trim()} onClick={searchPlaces}>{busy === 'places' ? 'Buscando…' : 'Consultar cerca de mí'}</IonButton>
              {address && <p><strong>Dirección:</strong> {address}</p>}
              <div className="places">{places.map((place) => <div key={`${place.lat}-${place.lng}`}><strong>{place.name}</strong><span>{formatDistance(place.distance)}</span></div>)}</div>
              {!apiKey && <IonText color="medium"><p>Necesitas una clave gratuita de OpenCage para activar esta consulta.</p></IonText>}
            </IonCardContent></IonCard>
          </div> : <HistoryPanel history={tracking.history} />}
        </main>
      </IonContent>
    </IonApp>
  );
}
