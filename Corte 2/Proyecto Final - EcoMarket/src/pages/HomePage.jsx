
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';

import {
  locationOutline,
  cameraOutline,
  speedometerOutline,
  phonePortraitOutline,
  pulseOutline,
  notificationsOutline,
  paperPlaneOutline,
} from 'ionicons/icons';

const sensores = [
  {
    titulo: 'Geolocalización',
    descripcion: 'Consulta la ubicación actual del dispositivo.',
    icono: locationOutline,
    ruta: '/geolocation',
  },
  {
    titulo: 'Cámara',
    descripcion: 'Captura una fotografía con la cámara.',
    icono: cameraOutline,
    ruta: '/camera',
  },
  {
    titulo: 'Movimiento',
    descripcion: 'Consulta los datos del acelerómetro.',
    icono: speedometerOutline,
    ruta: '/motion',
  },
  {
    titulo: 'Información del dispositivo',
    descripcion: 'Consulta la información del dispositivo.',
    icono: phonePortraitOutline,
    ruta: '/device',
  },
  {
    titulo: 'Hápticos',
    descripcion: 'Prueba la respuesta háptica del dispositivo.',
    icono: pulseOutline,
    ruta: '/haptics',
  },
  {
    titulo: 'Notificaciones locales',
    descripcion: 'Programa una notificación local.',
    icono: notificationsOutline,
    ruta: '/local-notifications',
  },
  {
    titulo: 'Notificaciones push',
    descripcion: 'Explora las notificaciones push.',
    icono: paperPlaneOutline,
    ruta: '/push-notifications',
  },
];

function HomePage() {
  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Challenge 07 - Sensores</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="bienvenida">
          <h1>Explorador de sensores</h1>
          <p>
            Selecciona una opción para explorar las funciones del dispositivo.
          </p>
        </div>

        <IonGrid>
          <IonRow>
            {sensores.map((sensor) => (
              <IonCol size="12" sizeMd="6" key={sensor.ruta}>
                <IonCard className="sensor-card">
                  <IonCardContent>
                    <div className="sensor-icono">
                      <IonIcon icon={sensor.icono} />
                    </div>

                    <h2>{sensor.titulo}</h2>
                    <p>{sensor.descripcion}</p>

                    <IonButton
                      expand="block"
                      routerLink={sensor.ruta}
                    >
                      Abrir
                    </IonButton>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
}

export default HomePage;
