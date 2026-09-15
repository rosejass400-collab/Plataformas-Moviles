import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonToast
} from '@ionic/react';

import { useState } from 'react';

const Login: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);

  const iniciarSesion = () => {
    const usuarioCorrecto = 'medico';
    const passwordCorrecto = '123456';

    if (
      usuario === usuarioCorrecto &&
      password === passwordCorrecto
    ) {
      // Guardar sesión en localStorage
      localStorage.setItem(
        'sesion',
        JSON.stringify({
          usuario: usuario
        })
      );

      // Recargar y entrar a la aplicación
      window.location.href = '/visitas';

    } else {
      // Mostrar mensaje de error con IonToast
      setMostrarToast(true);
    }
  };

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>MediClinic</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <h2>Inicio de sesión</h2>

        <IonItem>
          <IonLabel position="stacked">
            Usuario
          </IonLabel>

          <IonInput
            value={usuario}
            onIonInput={(e) =>
              setUsuario(e.detail.value || '')
            }
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">
            Contraseña
          </IonLabel>

          <IonInput
            type="password"
            value={password}
            onIonInput={(e) =>
              setPassword(e.detail.value || '')
            }
          />
        </IonItem>

        <IonButton
          expand="block"
          className="ion-margin-top"
          onClick={iniciarSesion}
        >
          Iniciar sesión
        </IonButton>

        <IonToast
          isOpen={mostrarToast}
          message="Usuario o contraseña incorrectos"
          duration={2000}
          color="danger"
          onDidDismiss={() => setMostrarToast(false)}
        />

      </IonContent>

    </IonPage>
  );
};

export default Login;