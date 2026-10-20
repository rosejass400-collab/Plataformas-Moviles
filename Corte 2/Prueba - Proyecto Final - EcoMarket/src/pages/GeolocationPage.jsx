import { useEffect, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonSpinner,
} from '@ionic/react';

import { Geolocation } from '@capacitor/geolocation';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from 'react-leaflet';

import 'leaflet/dist/leaflet.css';

const CENTRO_INICIAL = [4.5709, -74.2973];

function CentrarMapa({ ubicacion }) {
  const mapa = useMap();

  useEffect(() => {
    if (ubicacion) {
      mapa.flyTo(
        [ubicacion.latitud, ubicacion.longitud],
        16,
        { duration: 1.5 }
      );
    }
  }, [ubicacion, mapa]);

  return null;
}

function GeolocationPage() {
  const [ubicacion, setUbicacion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const consultarUbicacion = async () => {
    setCargando(true);
    setError('');

    try {
      const permisos = await Geolocation.checkPermissions();

      if (permisos.location !== 'granted' &&
          permisos.coarseLocation !== 'granted') {
        const solicitud = await Geolocation.requestPermissions();

        if (solicitud.location !== 'granted' &&
            solicitud.coarseLocation !== 'granted') {
          throw new Error('PERMISO_DENEGADO');
        }
      }

      const posicion = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      });

      setUbicacion({
        latitud: posicion.coords.latitude,
        longitud: posicion.coords.longitude,
        precision: posicion.coords.accuracy,
      });
    } catch (err) {
      console.error('Error de geolocalización:', err);

      if (err.message === 'PERMISO_DENEGADO') {
        setError(
          'No se concedió el permiso de ubicación. Actívalo en los ajustes de la aplicación.'
        );
      } else {
        setError(
          'No se pudo obtener la ubicación. Verifica que el GPS esté activado y que la aplicación tenga permiso para acceder a la ubicación.'
        );
      }
    } finally {
      setCargando(false);
    }
  };

  const centroMapa = ubicacion
    ? [ubicacion.latitud, ubicacion.longitud]
    : CENTRO_INICIAL;

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Volver" />
          </IonButtons>
          <IonTitle>Geolocalización</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>Ubicación del dispositivo</h1>

        <p>
          Consulta tu ubicación actual y visualízala en el mapa.
        </p>

        <IonButton
          expand="block"
          onClick={consultarUbicacion}
          disabled={cargando}
        >
          {cargando ? (
            <>
              <IonSpinner name="crescent" />
              <span style={{ marginLeft: '10px' }}>
                Consultando ubicación...
              </span>
            </>
          ) : (
            'Obtener mi ubicación'
          )}
        </IonButton>

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <div
          style={{
            height: '350px',
            width: '100%',
            marginTop: '16px',
            marginBottom: '16px',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #d7d7d7',
          }}
        >
          <MapContainer
            center={centroMapa}
            zoom={ubicacion ? 16 : 5}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <CentrarMapa ubicacion={ubicacion} />

            {ubicacion && (
              <CircleMarker
                center={[ubicacion.latitud, ubicacion.longitud]}
                radius={10}
                pathOptions={{
                  color: '#ffffff',
                  weight: 3,
                  fillColor: '#075bea',
                  fillOpacity: 1,
                }}
              >
                <Popup>
                  <strong>Tu ubicación actual</strong>
                  <br />
                  Latitud: {ubicacion.latitud.toFixed(6)}
                  <br />
                  Longitud: {ubicacion.longitud.toFixed(6)}
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        </div>

        {!ubicacion && !cargando && !error && (
          <IonText color="medium">
            <p>
              Pulsa «Obtener mi ubicación» para localizarte en el mapa.
            </p>
          </IonText>
        )}

        {ubicacion && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Ubicación obtenida</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p>
                <strong>Latitud:</strong>{' '}
                {ubicacion.latitud.toFixed(6)}
              </p>

              <p>
                <strong>Longitud:</strong>{' '}
                {ubicacion.longitud.toFixed(6)}
              </p>

              <p>
                <strong>Precisión:</strong>{' '}
                {ubicacion.precision.toFixed(2)} metros
              </p>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </>
  );
}

export default GeolocationPage;