import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

function ListPage({ onLogout }) {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <h2>¡Bienvenido!</h2>

        <p>Has iniciado sesión correctamente.</p>

        <h3>Lista de tareas</h3>

        <ul>
          <li>Estudiar Ionic</li>
          <li>Crear aplicación móvil</li>
          <li>Finalizar Challenge 04</li>
        </ul>

        <IonButton
          expand="block"
          color="danger"
          onClick={onLogout}
        >
          Logout
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default ListPage;