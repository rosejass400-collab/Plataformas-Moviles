
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

import { Motion } from '@capacitor/motion';

function MotionPage() {
  const [aceleracion, setAceleracion] = useState(null);
  const [escuchando, setEscuchando] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!escuchando) {
      return undefined;
    }

    let activo = true;
    let listener;

    const iniciarSensor = async () => {
      try {
        listener = await Motion.addListener('accel', (evento) => {
          if (activo) {
            setAceleracion(evento);
          }
        });
      } catch (err) {
        console.error('Error del acelerómetro:', err);
        if (activo) {
          setError(
            'No fue posible acceder al sensor de movimiento en este entorno.'
          );
          setEscuchando(false);
        }
      }
    };

    iniciarSensor();

    return () => {
      activo = false;
      listener?.remove();
    };
  }, [escuchando, revision]);

  const detenerSensor = () => {
    setEscuchando(false);
    setRevision((valor) => valor + 1);
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Volver" />
          </IonButtons>
          <IonTitle>Movimiento</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>Acelerómetro</h1>
        <p>
          Mide la aceleración en los ejes X, Y y Z del dispositivo.
        </p>

        {!escuchando ? (
          <IonButton
            expand="block"
            onClick={() => {
              setError('');
              setEscuchando(true);
            }}
          >
            Iniciar medición
          </IonButton>
        ) : (
          <IonButton
            expand="block"
            color="danger"
            onClick={detenerSensor}
          >
            Detener medición
          </IonButton>
        )}

        {aceleracion && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Datos del acelerómetro</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                <strong>X:</strong>{' '}
                {aceleracion.acceleration?.x?.toFixed(3) ?? 'No disponible'}
              </p>
              <p>
                <strong>Y:</strong>{' '}
                {aceleracion.acceleration?.y?.toFixed(3) ?? 'No disponible'}
              </p>
              <p>
                <strong>Z:</strong>{' '}
                {aceleracion.acceleration?.z?.toFixed(3) ?? 'No disponible'}
              </p>
            </IonCardContent>
          </IonCard>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}

        <p>
          Nota: el sensor puede requerir un dispositivo físico y permisos
          específicos del navegador.
        </p>
      </IonContent>
    </>
  );
}

export default MotionPage;
