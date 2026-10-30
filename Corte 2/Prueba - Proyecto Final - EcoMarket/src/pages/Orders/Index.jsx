import { useEffect, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useAuth } from '../../hooks/useAuth.js';

function timestampValue(value) {
  if (typeof value?.toMillis === 'function') return value.toMillis();
  const parsed = value ? new Date(value).getTime() : 0;
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatDate(value) {
  const date = typeof value?.toDate === 'function' ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleString('es-CO') : 'Fecha no disponible';
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loadedUid, setLoadedUid] = useState(null);
  const [error, setError] = useState('');
  const loading = Boolean(user && db && loadedUid !== user.uid);
  const visibleError = user && !db
    ? 'Firebase no está configurado.'
    : loadedUid === user?.uid ? error : '';

  useEffect(() => {
    if (!user || !db) return undefined;

    const ordersQuery = query(collection(db, 'orders'), where('uid', '==', user.uid));
    return onSnapshot(ordersQuery, snapshot => {
      const nextOrders = snapshot.docs.map(orderDoc => ({ id: orderDoc.id, ...orderDoc.data() }));
      nextOrders.sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt));
      setOrders(nextOrders);
      setError('');
      setLoadedUid(user.uid);
    }, () => {
      setError('No se pudieron cargar tus pedidos. Revisa la conexión y las reglas de Firestore.');
      setLoadedUid(user.uid);
    });
  }, [user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/profile" text="Perfil" /></IonButtons>
          <IonTitle>Mis pedidos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!user ? <>
          <div className="notice">Inicia sesión desde Perfil para consultar tus pedidos.</div>
          <IonButton routerLink="/profile">Ir a Perfil</IonButton>
        </> : <>
          {visibleError && <div className="notice error">{visibleError}</div>}
          {loading ? <p>Cargando pedidos…</p> : orders.length === 0 ? <div className="empty">
            <h2>Aún no tienes pedidos</h2>
            <p>Cuando confirmes una compra, aparecerá aquí.</p>
            <IonButton routerLink="/home">Explorar productos</IonButton>
          </div> : <IonList>
            {orders.map(order => (
              <IonItem key={order.id} lines="full">
                <IonLabel className="order-history-item">
                  <h2>Pedido {order.id.slice(0, 8)}</h2>
                  <p>{formatDate(order.createdAt)} · {order.status || 'Pendiente'}</p>
                  <p>{(order.items || []).map(item => `${item.name} × ${item.quantity}`).join(', ') || 'Productos del pedido'}</p>
                  <p><strong>Total: ${Number(order.total || 0).toLocaleString('es-CO')}</strong></p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>}
        </>}
      </IonContent>
    </IonPage>
  );
}
