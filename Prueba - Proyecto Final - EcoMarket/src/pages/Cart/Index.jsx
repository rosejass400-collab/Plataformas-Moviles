import { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import { createOrder } from '../../services/orderService.js';

export default function Cart() {
  const { items, total, update, clear } = useCart();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const checkout = async () => {
    if (!items.length || busy) return;
    if (!user) {
      setMessage('Inicia sesión desde Perfil para confirmar el pedido.');
      return;
    }

    setBusy(true);
    setMessage('');
    try {
      const id = await createOrder(user, items, total);
      clear();
      setMessage(`Pedido ${id.slice(0, 8)} guardado. El carrito se vació correctamente.`);
    } catch {
      setMessage('No fue posible registrar el pedido. Verifica la conexión e intenta de nuevo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <IonPage>
      <IonHeader><IonToolbar><IonTitle>Mi carrito</IonTitle></IonToolbar></IonHeader>
      <IonContent className="ion-padding">
        {message && (
          <div className="notice">
            {message}
            {!user && <IonButton size="small" fill="clear" routerLink="/profile">Ir a Perfil</IonButton>}
          </div>
        )}
        {!items.length ? (
          <div className="empty">
            <h2>Tu carrito está vacío</h2>
            <p>{message.startsWith('Pedido ') ? 'Tu compra quedó registrada; agrega más productos cuando quieras.' : 'Agrega productos sostenibles desde el inicio.'}</p>
            <IonButton routerLink="/home">Seguir comprando</IonButton>
          </div>
        ) : (
          <>
            <IonList>
              {items.map(item => (
                <IonItem key={item.id}>
                  <IonLabel>
                    <h2>{item.name}</h2>
                    <p>${item.price.toLocaleString('es-CO')} · Cantidad: {item.quantity}</p>
                  </IonLabel>
                  <IonButton fill="clear" aria-label={`Quitar una unidad de ${item.name}`} onClick={() => update(item.id, item.quantity - 1)}>−</IonButton>
                  <IonButton fill="clear" aria-label={`Agregar una unidad de ${item.name}`} onClick={() => update(item.id, item.quantity + 1)}>+</IonButton>
                </IonItem>
              ))}
            </IonList>
            <div className="total">
              <strong>Total: ${total.toLocaleString('es-CO')}</strong>
              <IonButton expand="block" disabled={busy} onClick={checkout}>
                {busy ? 'Guardando pedido…' : 'Confirmar pedido'}
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
}
