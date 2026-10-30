import { useEffect, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import { arrayRemove, arrayUnion, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [street, setStreet] = useState('');
  const [details, setDetails] = useState('');
  const [loadedUid, setLoadedUid] = useState(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const loading = Boolean(user && db && loadedUid !== user.uid);

  useEffect(() => {
    if (!user || !db) return undefined;

    const userRef = doc(db, 'users', user.uid);
    return onSnapshot(userRef, snapshot => {
      const savedAddresses = snapshot.exists() ? snapshot.data().addresses : [];
      setAddresses(Array.isArray(savedAddresses) ? savedAddresses : []);
      setError('');
      setLoadedUid(user.uid);
    }, () => {
      setError('No se pudieron cargar tus direcciones. Revisa las reglas de Firestore.');
      setLoadedUid(user.uid);
    });
  }, [user]);

  const saveAddress = async () => {
    if (!user || !db) {
      setError('Inicia sesión para guardar una dirección.');
      return;
    }
    if (!recipient.trim() || !street.trim()) {
      setError('Completa el nombre de quien recibe y la dirección.');
      return;
    }

    setSaving(true);
    setError('');
    setNotice('');
    const address = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      recipient: recipient.trim(),
      street: street.trim(),
      details: details.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'users', user.uid), { addresses: arrayUnion(address) }, { merge: true });
      setRecipient('');
      setStreet('');
      setDetails('');
      setNotice('Dirección guardada correctamente.');
    } catch {
      setError('No se pudo guardar la dirección. Revisa conexión y reglas de Firestore.');
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async address => {
    if (!user || !db) return;
    setError('');
    setNotice('');
    try {
      await updateDoc(doc(db, 'users', user.uid), { addresses: arrayRemove(address) });
      setNotice('Dirección eliminada.');
    } catch {
      setError('No se pudo eliminar la dirección. Intenta de nuevo.');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/profile" text="Perfil" /></IonButtons>
          <IonTitle>Direcciones de entrega</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!user ? <>
          <div className="notice">Inicia sesión desde Perfil para administrar tus direcciones.</div>
          <IonButton routerLink="/profile">Ir a Perfil</IonButton>
        </> : <>
          <div className="notice">Guarda las direcciones que quieras usar para tus entregas.</div>
          {notice && <div className="notice success-notice">{notice}</div>}
          {error && <div className="notice error">{error}</div>}
          <IonList className="address-form">
            <IonItem>
              <IonInput label="Nombre de quien recibe" autocomplete="name" value={recipient} onIonInput={event => setRecipient(event.detail.value || '')} />
            </IonItem>
            <IonItem>
              <IonInput label="Dirección" autocomplete="street-address" value={street} onIonInput={event => setStreet(event.detail.value || '')} />
            </IonItem>
            <IonItem>
              <IonTextarea label="Indicaciones adicionales (opcional)" autoGrow value={details} onIonInput={event => setDetails(event.detail.value || '')} />
            </IonItem>
          </IonList>
          <IonButton expand="block" disabled={saving} onClick={saveAddress}>
            {saving ? 'Guardando…' : 'Guardar dirección'}
          </IonButton>

          <h2 className="section-title">Mis direcciones guardadas</h2>
          {loading ? <p>Cargando direcciones…</p> : addresses.length === 0 ? <div className="empty"><p>Aún no guardas direcciones de entrega.</p></div> : (
            <IonList>
              {addresses.map(address => (
                <IonItem key={address.id} lines="full">
                  <IonLabel>
                    <h2>{address.recipient}</h2>
                    <p>{address.street}</p>
                    {address.details && <p>{address.details}</p>}
                  </IonLabel>
                  <IonButton slot="end" fill="clear" color="danger" aria-label={`Eliminar dirección de ${address.recipient}`} onClick={() => deleteAddress(address)}>Eliminar</IonButton>
                </IonItem>
              ))}
            </IonList>
          )}
        </>}
      </IonContent>
    </IonPage>
  );
}
