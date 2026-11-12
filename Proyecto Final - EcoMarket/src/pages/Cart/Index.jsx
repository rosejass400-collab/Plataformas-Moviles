import { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import { LocalNotifications } from '@capacitor/local-notifications';
import ShopHeader from '../../components/Shared/ShopHeader.jsx';
import { useCart } from '../../hooks/useCart.js';
import { useAuth } from '../../hooks/useAuth.js';
import { money } from '../../helpers/format.js';
import { createOrder } from '../../services/orderService.js';
import { marketHero } from '../../data/demoProducts.js';

export default function Cart() {
  const { items, total, update, clear } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const shipping = items.length ? 6000 : 0;

  const checkout = async () => {
    if (!items.length || busy) return;
    if (!user) { setMessage('Inicia sesión para confirmar tu pedido.'); return; }
    if (!address.trim()) { setMessage('Escribe la dirección de entrega.'); return; }
    setBusy(true);
    setMessage('');
    try {
      const id = await createOrder(user, items, total + shipping, address);
      clear();
      setAddress('');
      setMessage(`Pedido ${id.slice(0, 8)} registrado. Puedes verlo en tu perfil.`);
      try {
        const permission = await LocalNotifications.requestPermissions();
        if (permission.display === 'granted') await LocalNotifications.schedule({ notifications: [{ id: Date.now() % 2147483647, title: 'EcoMarket', body: `Tu pedido ${id.slice(0, 8)} quedó registrado.`, schedule: { at: new Date(Date.now() + 1500) } }] });
      } catch { /* El pedido sigue registrado aunque no se permitan notificaciones. */ }
    } catch {
      setMessage('No fue posible registrar el pedido. Verifica internet e inténtalo de nuevo.');
    } finally { setBusy(false); }
  };

  return <IonPage><IonContent>
    <ShopHeader />
    <main className="page-shell">
      <div className="page-intro"><span className="eyebrow">TU SELECCIÓN</span><h1>Mi canasta.</h1><p>Un paso más cerca de lo local.</p></div>
      {message && <div className="notice" role="status">{message} {!user && <Link to="/auth">Entrar</Link>}</div>}
      {!items.length ? <div className="empty-cart"><span>🧺</span><h2>Tu canasta está esperando</h2><p>Descubre productos frescos y locales para empezar.</p><Link to="/catalog" className="primary-button">Explorar productos</Link></div> : <>
        <div className="cart-items">{items.map(item => <div className="cart-item" key={item.id}>
          <img src={item.image || item.imageUrl || marketHero} alt="" />
          <div><strong>{item.name}</strong><small>{item.unit}</small><b>{money(item.price)}</b></div>
          <div className="quantity"><button aria-label={`Quitar una unidad de ${item.name}`} onClick={() => update(item.id, item.quantity - 1)}>−</button><span>{item.quantity}</span><button aria-label={`Agregar una unidad de ${item.name}`} onClick={() => update(item.id, item.quantity + 1)}>+</button></div>
        </div>)}</div>
        <div className="checkout-card"><h2>Entrega</h2><label>Dirección de entrega<input autoComplete="street-address" placeholder="Calle, número, barrio y ciudad" value={address} onChange={event => setAddress(event.target.value)} /></label><p>Los pedidos se registran para demostración; el pago no se realiza en la app.</p></div>
        <div className="checkout-card"><h2>Resumen del pedido</h2><div><span>Subtotal</span><strong>{money(total)}</strong></div><div><span>Envío estimado</span><strong>{money(shipping)}</strong></div><div className="grand-total"><span>Total</span><strong>{money(total + shipping)}</strong></div><button className="primary-button" disabled={busy} onClick={checkout}>{busy ? 'Guardando…' : 'Confirmar pedido'}</button></div>
      </>}
    </main>
  </IonContent></IonPage>;
}
