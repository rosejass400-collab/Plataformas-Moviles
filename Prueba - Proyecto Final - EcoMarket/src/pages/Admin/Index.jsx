import { useEffect, useState } from 'react';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function Admin() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || !db) return undefined;
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    return onSnapshot(ordersQuery, snapshot => {
      setOrders(snapshot.docs.map(orderDoc => ({ id: orderDoc.id, ...orderDoc.data() })));
    }, () => setOrders([]));
  }, [user]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/profile" text="Perfil" /></IonButtons>
          <IonTitle>Administración</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!user ? <div className="notice">Inicia sesión para consultar los pedidos.</div> : <>
          <div className="notice">Panel conectado a los pedidos registrados en Firestore.</div>
          <h2>Pedidos recientes: {orders.length}</h2>
          <IonList>
            {orders.length === 0 ? <IonItem><IonLabel>No hay pedidos registrados.</IonLabel></IonItem> : orders.map(order => (
              <IonItem key={order.id}>
                <IonLabel>
                  <h3>Pedido {order.id.slice(0, 8)}</h3>
                  <p>{order.customerName || order.customerEmail || 'Cliente de prueba'} · {order.status || 'Pendiente'}</p>
                  <p>${Number(order.total || 0).toLocaleString('es-CO')}</p>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </>}
      </IonContent>
    </IonPage>
  );
}
