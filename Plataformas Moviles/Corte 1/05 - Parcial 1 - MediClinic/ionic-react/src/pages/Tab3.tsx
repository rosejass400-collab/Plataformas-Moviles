import {
  IonAvatar,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/react';

import './Tab3.css';

const Tab3: React.FC = () => {

  const cerrarSesion = () => {
    // Eliminar la sesión guardada
    localStorage.removeItem('sesion');

    // Regresar al Login
    window.location.href = '/login';
  };

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mi perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <div className="perfil-container">

          <IonAvatar className="perfil-avatar">
            <img
              src="https://ionicframework.com/docs/img/demos/avatar.svg"
              alt="Perfil del médico"
            />
          </IonAvatar>

          <h2>Dr. Juan Martínez</h2>

          <p>Médico domiciliario</p>

        </div>

        <IonList>

          <IonItem>
            <IonLabel>
              <h3>Correo electrónico</h3>
              <p>juan.martinez@mediclinic.com</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel>
              <h3>Teléfono</h3>
              <p>300 123 4567</p>
            </IonLabel>
          </IonItem>

        </IonList>

        <IonButton
          expand="block"
          color="danger"
          onClick={cerrarSesion}
        >
          Cerrar sesión
        </IonButton>

      </IonContent>

    </IonPage>
  );
};

export default Tab3;