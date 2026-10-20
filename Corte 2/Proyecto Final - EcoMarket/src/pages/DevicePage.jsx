
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
  IonSpinner,
} from '@ionic/react';

import { Device } from '@capacitor/device';

function DevicePage() {
  const [informacion, setInformacion] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const consultarDispositivo = async () => {
    setCargando(true);
    setError('');

    try {
      const [info, bateria, idioma] = await Promise.all([
        Device.getInfo(),
        Device.getBatteryInfo(),
        Device.getLanguageCode(),
      ]);

      setInformacion({
        modelo: info.model,
        fabricante: info.manufacturer,
        plataforma: info.platform,
        sistemaOperativo: info.operatingSystem,
        versionSO: info.osVersion,
        versionAplicacion: info.appVersion ?? 'No disponible',
        bateria: bateria.batteryLevel != null
          ? `${Math.round(bateria.batteryLevel * 100)} %`
          : 'No disponible',
        cargando: bateria.isCharging ? 'Sí' : 'No',
        idioma: idioma.value,
        virtual: info.isVirtual ? 'Sí' : 'No',
      });
    } catch (err) {
      console.error('Error consultando el dispositivo:', err);
      setError(
        'No fue posible consultar la información del dispositivo en este entorno.'
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
          <IonTitle>Información del dispositivo</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h1>Datos del dispositivo</h1>
        <p>
          Consulta información del sistema operativo, plataforma, batería
          e idioma.
        </p>

        <IonButton
          expand="block"
          onClick={consultarDispositivo}
          disabled={cargando}
        >
          {cargando ? (
            <>
              <IonSpinner name="crescent" />
              <span style={{ marginLeft: '10px' }}>Consultando...</span>
            </>
          ) : (
            'Consultar información'
          )}
        </IonButton>

        {informacion && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Información obtenida</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <p><strong>Modelo:</strong> {informacion.modelo}</p>
              <p><strong>Fabricante:</strong> {informacion.fabricante}</p>
              <p><strong>Plataforma:</strong> {informacion.plataforma}</p>
              <p><strong>Sistema operativo:</strong> {informacion.sistemaOperativo}</p>
              <p><strong>Versión del sistema:</strong> {informacion.versionSO}</p>
              <p><strong>Versión de la aplicación:</strong> {informacion.versionAplicacion}</p>
              <p><strong>Batería:</strong> {informacion.bateria}</p>
              <p><strong>¿Está cargando?:</strong> {informacion.cargando}</p>
              <p><strong>Idioma:</strong> {informacion.idioma}</p>
              <p><strong>¿Dispositivo virtual?:</strong> {informacion.virtual}</p>
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

export default DevicePage;
