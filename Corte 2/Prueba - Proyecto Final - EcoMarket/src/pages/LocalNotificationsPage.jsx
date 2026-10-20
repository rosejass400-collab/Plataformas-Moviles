
import { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCard,
  IonCardContent,
  IonText,
  IonInput,
} from '@ionic/react';

import { LocalNotifications } from '@capacitor/local-notifications';

function LocalNotificationsPage() {
  const [titulo, setTitulo] = useState('Challenge 07');
  const [mensaje, setMensaje] = useState(
    'Esta es una notificación local de prueba.'
  );
  const [resultado, setResultado] = useState('');
  const [error, setError] = useState('');

  const programarNotificacion = async () => {
    setResultado('');
    setError('');

    try {
      const permisos = await LocalNotifications.requestPermissions();

      if (permisos.display !== 'granted') {
        setError(
          'No se concedió permiso para mostrar notificaciones.'
        );
        return;
      }

      await LocalNotifications.schedule({
        notifications: [
          {
            id: 707,
            title: titulo.trim() || 'Challenge 07',
            body: mensaje.trim() || 'Notificación de prueba.',
            schedule: {
              at: new Date(Date.now() + 5000),
              allowWhileIdle: true,
            },
          },
        ],
      });

      setResultado(
        'Notificación programada. Debería aparecer en aproximadamente 5 segundos.'
      );
    } catch (err) {
      console.error('Error al programar la notificación:', err);
      setError(
        'No se pudo programar la notificación. Comprueba los permisos y el entorno de ejecución.'
      );
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Volver" />
          </IonButtons>
          <IonTitle>Notificaciones locales</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>Programar notificación</h1>
        <p>
          Personaliza una notificación local que se programará para aparecer
          aproximadamente cinco segundos después.
        </p>

        <IonCard>
          <IonCardContent>
            <IonInput
              label="Título"
              labelPlacement="stacked"
              value={titulo}
              onIonInput={(evento) =>
                setTitulo(evento.detail.value ?? '')
              }
              placeholder="Título de la notificación"
            />

            <IonInput
              label="Mensaje"
              labelPlacement="stacked"
              value={mensaje}
              onIonInput={(evento) =>
                setMensaje(evento.detail.value ?? '')
              }
              placeholder="Texto de la notificación"
            />

            <IonButton
              expand="block"
              onClick={programarNotificacion}
            >
              Programar notificación
            </IonButton>
          </IonCardContent>
        </IonCard>

        {resultado && (
          <IonText color="success">
            <p>{resultado}</p>
          </IonText>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <p>
          Nota: la notificación nativa debe probarse en un dispositivo o
          emulador compatible; el navegador web no reproduce necesariamente
          este comportamiento.
        </p>
      </IonContent>
    </>
  );
}

export default LocalNotificationsPage;
