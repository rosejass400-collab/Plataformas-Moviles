
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
} from '@ionic/react';

import {
  Haptics,
  ImpactStyle,
  NotificationType,
} from '@capacitor/haptics';

function HapticsPage() {
  const [mensaje, setMensaje] = useState('');

  const vibracionLigera = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
      setMensaje('Se solicitó una vibración ligera.');
    } catch (error) {
      console.error('Error en la respuesta háptica:', error);
      setMensaje('No fue posible ejecutar la respuesta háptica.');
    }
  };

  const vibracionMedia = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
      setMensaje('Se solicitó una vibración media.');
    } catch (error) {
      console.error('Error en la respuesta háptica:', error);
      setMensaje('No fue posible ejecutar la respuesta háptica.');
    }
  };

  const vibracionFuerte = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      setMensaje('Se solicitó una vibración fuerte.');
    } catch (error) {
      console.error('Error en la respuesta háptica:', error);
      setMensaje('No fue posible ejecutar la respuesta háptica.');
    }
  };

  const notificacionCorrecta = async () => {
    try {
      await Haptics.notification({
        type: NotificationType.Success,
      });
      setMensaje('Se solicitó una respuesta háptica de éxito.');
    } catch (error) {
      console.error('Error en la respuesta háptica:', error);
      setMensaje('No fue posible ejecutar la respuesta háptica.');
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Volver" />
          </IonButtons>
          <IonTitle>Hápticos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>Respuesta háptica</h1>
        <p>
          Prueba diferentes intensidades de respuesta táctil del dispositivo.
        </p>

        <IonCard>
          <IonCardContent>
            <IonButton expand="block" onClick={vibracionLigera}>
              Vibración ligera
            </IonButton>

            <IonButton expand="block" onClick={vibracionMedia}>
              Vibración media
            </IonButton>

            <IonButton expand="block" onClick={vibracionFuerte}>
              Vibración fuerte
            </IonButton>

            <IonButton
              expand="block"
              color="success"
              onClick={notificacionCorrecta}
            >
              Respuesta de éxito
            </IonButton>
          </IonCardContent>
        </IonCard>

        {mensaje && (
          <IonText color="primary">
            <p>{mensaje}</p>
          </IonText>
        )}

        <p>
          Nota: el resultado físico depende de las capacidades del dispositivo.
          En un computador o navegador puede no sentirse ninguna vibración.
        </p>
      </IonContent>
    </>
  );
}

export default HapticsPage;
