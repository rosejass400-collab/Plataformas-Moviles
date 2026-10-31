import { useEffect, useMemo, useState } from 'react';
import { IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import MapPanel from './MapPanel';
import { formatDistance } from '../services/geo';
import { loadPhoto } from '../services/storage';

function HistoryPhoto({ path }) {
  const [source, setSource] = useState('');
  useEffect(() => { loadPhoto(path).then(setSource).catch(() => setSource('')); }, [path]);
  return source ? <img className="history-photo" src={source} alt="Foto del recorrido con coordenadas" /> : null;
}

export default function HistoryPanel({ history }) {
  const dates = useMemo(() => [...new Set(history.map((track) => track.date))], [history]);
  const [date, setDate] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const visibleDate = dates.includes(date) ? date : (dates[0] || '');
  const tracks = history.filter((track) => track.date === visibleDate);
  const selected = tracks.find((track) => track.id === selectedId) || tracks[0];

  if (!history.length) return <div className="empty-card"><h2>Sin recorridos todavía</h2><p>Inicia y detén un seguimiento para guardar su archivo JSON en este dispositivo.</p></div>;

  return (
    <section className="stack">
      <IonCard className="panel">
        <IonCardHeader><IonCardTitle>Historial por día</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonItem lines="none"><IonLabel>Fecha</IonLabel><IonSelect value={visibleDate} onIonChange={(event) => { setDate(event.detail.value); setSelectedId(''); }}><IonSelectOption value="">Selecciona un día</IonSelectOption>{dates.map((day) => <IonSelectOption key={day} value={day}>{day}</IonSelectOption>)}</IonSelect></IonItem>
          <div className="history-list">{tracks.map((track) => <IonButton key={track.id} fill={selected?.id === track.id ? 'solid' : 'outline'} size="small" onClick={() => setSelectedId(track.id)}>{new Date(track.startedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</IonButton>)}</div>
        </IonCardContent>
      </IonCard>
      {selected && <IonCard className="panel">
        <IonCardHeader><IonCardTitle>Recorrido de las {new Date(selected.startedAt).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <div className="badges"><IonBadge>{formatDistance(selected.meters || 0)}</IonBadge><IonBadge color="medium">{selected.points.length} puntos GPS</IonBadge><IonBadge color="medium">{selected.photos?.length || 0} fotos</IonBadge></div>
          <p>Archivo JSON guardado en el almacenamiento privado de la app.</p>
          <MapPanel points={selected.points} />
          <div className="photo-grid">{selected.photos?.map((photo) => <HistoryPhoto key={photo.path} path={photo.path} />)}</div>
        </IonCardContent>
      </IonCard>}
    </section>
  );
}
