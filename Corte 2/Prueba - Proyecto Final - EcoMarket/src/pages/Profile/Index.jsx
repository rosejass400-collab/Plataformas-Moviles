import { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useAuth } from '../../hooks/useAuth.js';
import { explainFirebaseError } from '../../helpers/firebaseErrors.js';

export default function Profile() {
  const { user, login, logout, firebaseEnabled } = useAuth();
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!firebaseEnabled) {
      setError('Firebase no está configurado.');
      return;
    }
    if (!name.trim()) {
      setError('Escribe cualquier nombre o alias para la sesión de prueba.');
      return;
    }

    setBusy(true);
    setError('');
    try {
      await login(name.trim());
    } catch (authError) {
      setError(explainFirebaseError(authError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Mi perfil</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        {user ? <>
          <div className="profile-head">
            <h2>{user.displayName || user.email || 'Usuario de prueba'}</h2>
            <p>Sesión de prueba activa</p>
          </div>
          <IonList>
            <IonItem button detail routerLink="/orders"><IonLabel>Mis pedidos</IonLabel></IonItem>
            <IonItem button detail routerLink="/addresses"><IonLabel>Direcciones de entrega</IonLabel></IonItem>
            <IonItem button detail routerLink="/native"><IonLabel>Funciones nativas</IonLabel></IonItem>
            <IonItem button detail routerLink="/admin"><IonLabel>Panel administrador</IonLabel></IonItem>
          </IonList>
          <IonButton expand="block" fill="outline" onClick={logout}>Cerrar sesión</IonButton>
        </> : <>
          <div className="profile-head">
            <h2>Bienvenido a EcoMarket</h2>
            <p>Modo de prueba universitario: ingresa con cualquier nombre o correo.</p>
          </div>
          {!firebaseEnabled && <div className="notice">Firebase aún no está configurado.</div>}
          <IonItem>
            <IonInput
              label="Nombre, alias o correo de prueba"
              type="text"
              autocomplete="off"
              value={name}
              onIonInput={event => setName(event.detail.value || '')}
            />
          </IonItem>
          {error && <p className="error">{error}</p>}
          <div className="notice">No se valida una contraseña ni se envía correo. Se crea una sesión anónima para usar el carrito, pedidos y chat.</div>
          <IonButton expand="block" disabled={busy} onClick={submit}>
            {busy ? 'Ingresando…' : 'Ingresar como usuario de prueba'}
          </IonButton>
        </>}
      </IonContent>
    </IonPage>
  );
}
