import { useEffect, useRef, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { stores } from '../../data/demoProducts.js';

const defaultCenter = [4.6097, -74.0817];
const currentLocationIcon = L.divIcon({
  className: 'current-location-div-icon',
  html: '<span class="current-location-dot" aria-hidden="true"></span>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});
const storeLocationIcon = L.divIcon({
  className: 'store-location-div-icon',
  html: '<span class="store-location-pin" aria-hidden="true"></span>',
  iconSize: [30, 36],
  iconAnchor: [15, 34],
});

function MapSizer({ center, onTileError, mapRef }) {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
    const timer = setTimeout(() => map.invalidateSize(true), 250);
    return () => clearTimeout(timer);
  }, [map, mapRef]);

  useEffect(() => {
    map.setView(center, 14, { animate: true });
    map.invalidateSize(true);
  }, [map, center]);

  return (
    <TileLayer
      attribution="&copy; OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      eventHandlers={{ tileerror: onTileError }}
    />
  );
}

export default function Map() {
  const [center, setCenter] = useState(defaultCenter);
  const [userPosition, setUserPosition] = useState(null);
  const [message, setMessage] = useState('Puntos de entrega en Bogotá.');
  const mapRef = useRef(null);

  const locate = async () => {
    try {
      const permission = await Geolocation.requestPermissions();
      if (permission.location === 'denied' && permission.coarseLocation === 'denied') {
        setMessage('Permite ubicación para EcoMarket en Ajustes del teléfono.');
        return;
      }
      const current = await Geolocation.getCurrentPosition({ enableHighAccuracy: false, timeout: 20000, maximumAge: 15000 });
      const nextPosition = [current.coords.latitude, current.coords.longitude];
      setUserPosition(nextPosition);
      setCenter(nextPosition);
      setMessage('Ubicación actualizada correctamente.');
    } catch (error) {
      setMessage(error?.message?.toLowerCase().includes('permission')
        ? 'Permite ubicación para EcoMarket en Ajustes del teléfono.'
        : 'No fue posible obtener ubicación. Activa GPS e internet e intenta de nuevo.');
    }
  };

  useIonViewDidEnter(() => {
    const timer = setTimeout(() => mapRef.current?.invalidateSize(true), 350);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    const timer = setTimeout(() => { void locate(); }, 0);
    return () => clearTimeout(timer);
  }, []);

  const focusStore = store => {
    setCenter([store.lat, store.lng]);
    setMessage(`Mostrando ${store.name} en el mapa.`);
  };

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Puntos EcoMarket</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" fill="outline" onClick={locate}>Usar mi ubicación</IonButton>
        <p className="map-message">{message}</p>
        <div className="leaflet-wrap">
          <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <MapSizer
              center={center}
              mapRef={mapRef}
              onTileError={() => setMessage('El mapa está cargando; verifica conexión a internet si los mosaicos no aparecen.')}
            />
            {userPosition && <Marker position={userPosition} icon={currentLocationIcon}><Popup>Tu ubicación actual</Popup></Marker>}
            {stores.map(store => (
              <Marker key={store.id} position={[store.lat, store.lng]} icon={storeLocationIcon}>
                <Popup><b>{store.name}</b><br />{store.address}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="map-legend" aria-label="Leyenda del mapa">
          <span><i className="legend-user" /> Mi ubicación</span>
          <span><i className="legend-store" /> Punto EcoMarket</span>
        </div>
        <IonList>
          {stores.map(store => (
            <IonItem key={store.id} button detail onClick={() => focusStore(store)}>
              <IonLabel><h2>{store.name}</h2><p>{store.address}</p></IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
