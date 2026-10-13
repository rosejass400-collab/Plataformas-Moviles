
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
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
} from '@ionic/react';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

function CameraPage() {
  const [foto, setFoto] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const tomarFoto = async () => {
    setCargando(true);
    setError('');

    try {
      const imagen = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      setFoto(imagen.dataUrl || '');
    } catch (err) {
      console.error('Error al abrir la cámara:', err);
      setError(
        'No se pudo obtener la fotografía. Verifica los permisos de cámara e inténtalo nuevamente.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" text="Volver" />
          </IonButtons>
          <IonTitle>Cámara</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>Cámara del dispositivo</h1>
        <p>
          Toma una fotografía o selecciona una imagen de la galería.
        </p>

        <IonButton
          expand="block"
          onClick={tomarFoto}
          disabled={cargando}
        >
          {cargando ? 'Abriendo cámara...' : 'Tomar fotografía'}
        </IonButton>

        {foto && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Fotografía capturada</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <img
                src={foto}
                alt="Fotografía capturada"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  display: 'block',
                }}
              />
            </IonCardContent>
          </IonCard>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
      </IonContent>
    </>
  );
}

export default CameraPage;
