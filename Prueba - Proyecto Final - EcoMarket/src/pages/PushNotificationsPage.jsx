
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
} from '@ionic/react';

import { PushNotifications } from '@capacitor/push-notifications';

function PushNotificationsPage() {
  const [permiso, setPermiso] = useState('Sin consultar');
  const [token, setToken] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const listeners = [];

    const registrarEventos = async () => {
      try {
        const registro = await PushNotifications.addListener(
          'registration',
          (resultado) => {
            setToken(resultado.value);
            setMensaje('Registro para notificaciones push completado.');
            setError('');
          }
        );
        listeners.push(registro);

        const errorRegistro = await PushNotifications.addListener(
          'registrationError',
          (resultado) => {
            console.error('Error de registro push:', resultado);
            setError(
              'No se pudo completar el registro para notificaciones push.'
            );
          }
        );
        listeners.push(errorRegistro);

        const notificacionRecibida = await PushNotifications.addListener(
          'pushNotificationReceived',
          (notificacion) => {
            setMensaje(
              `Notificación recibida: ${notificacion.title || 'Sin título'} - ${
                notificacion.body || 'Sin contenido'
              }`
            );
          }
        );
        listeners.push(notificacionRecibida);

        const notificacionAbierta = await PushNotifications.addListener(
          'pushNotificationActionPerformed',
          (evento) => {
            setMensaje(
              `Abriste una notificación: ${
                evento.notification.title || 'Sin título'
              }`
            );
          }
        );
        listeners.push(notificacionAbierta);
      } catch (err) {
        console.error('Error configurando eventos push:', err);
        setError('No se pudieron configurar los eventos de notificaciones.');
      }
    };

    registrarEventos();

    return () => {
      listeners.forEach((listener) => listener.remove());
    };
  }, []);

  const registrarNotificaciones = async () => {
    setMensaje('');
    setError('');
    setToken('');

    try {
      let estado = await PushNotifications.checkPermissions();

      if (estado.receive === 'prompt') {
        estado = await PushNotifications.requestPermissions();
      }

      setPermiso(estado.receive);

      if (estado.receive !== 'granted') {
        setError(
          'No se concedió permiso para recibir notificaciones push.'
        );
        return;
      }

      await PushNotifications.register();

      setMensaje(
        'Se solicitó el registro. Espera la respuesta del servicio de notificaciones.'
      );
    } catch (err) {
      console.error('Error al registrar notificaciones push:', err);
      setError(
        'No se pudo iniciar el registro. Esta función requiere un entorno nativo compatible y su configuración.'
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
          <IonTitle>Notificaciones push</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>Registro de notificaciones push</h1>

        <p>
          Solicita permiso para recibir notificaciones remotas y consulta
          el token de registro cuando el dispositivo lo genere.
        </p>

        <IonButton
          expand="block"
          onClick={registrarNotificaciones}
        >
          Registrar dispositivo
        </IonButton>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Estado del registro</IonCardTitle>
          </IonCardHeader>

          <IonCardContent>
            <p>
              <strong>Permiso:</strong> {permiso}
            </p>

            {token && (
              <>
                <p><strong>Token de registro:</strong></p>
                <p style={{ overflowWrap: 'anywhere' }}>{token}</p>
                <IonButton
                  expand="block"
                  fill="outline"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(token);
                      setMensaje('Token copiado al portapapeles.');
                    } catch {
                      setError('No se pudo copiar el token.');
                    }
                  }}
                >
                  Copiar token
                </IonButton>
              </>
            )}
          </IonCardContent>
        </IonCard>

        {mensaje && (
          <IonText color="success">
            <p>{mensaje}</p>
          </IonText>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <p>
          <strong>Nota:</strong> recibir notificaciones push requiere
          configuración adicional de la plataforma nativa y del servicio
          correspondiente. En Android normalmente se configura Firebase
          Cloud Messaging; en iOS se requiere la configuración de Apple
          Push Notification service. El navegador no garantiza el registro
          mediante este complemento.
        </p>
      </IonContent>
    </>
  );
}

export default PushNotificationsPage;
