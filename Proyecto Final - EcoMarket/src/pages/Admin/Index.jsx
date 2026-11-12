import { useEffect, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import { addDoc, collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useProducts } from '../../hooks/useProducts.js';
import { money } from '../../helpers/format.js';
import { sendChatMessage, subscribeToChat } from '../../services/chatService.js';

export default function Admin() {
  const { user } = useAuth();
  const products = useProducts();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState('');
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [draft, setDraft] = useState({ name: '', category: 'Frutas y verduras', price: '', unit: '', origin: '', description: '', imageUrl: '' });
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!db) return undefined;
    const unsubscribeOrders = onSnapshot(query(collection(db, 'orders'), orderBy('createdAt', 'desc')), snapshot => setOrders(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))), () => setNotice('No se pudieron cargar los pedidos.'));
    const unsubscribeChats = onSnapshot(query(collection(db, 'chats'), orderBy('updatedAt', 'desc')), snapshot => setChats(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))), () => setNotice('No se pudieron cargar las conversaciones.'));
    return () => { unsubscribeOrders(); unsubscribeChats(); };
  }, []);

  useEffect(() => {
    if (!selectedChat) return undefined;
    return subscribeToChat(selectedChat, setMessages, () => setNotice('No se pudo abrir la conversación.'));
  }, [selectedChat]);

  const updateStatus = async (id, status) => {
    try { await updateDoc(doc(db, 'orders', id), { status }); setNotice('Estado actualizado.'); }
    catch { setNotice('No se pudo actualizar el pedido.'); }
  };

  const saveProduct = async event => {
    event.preventDefault();
    try {
      await addDoc(collection(db, 'products'), { ...draft, price: Number(draft.price), active: true });
      setDraft({ name: '', category: 'Frutas y verduras', price: '', unit: '', origin: '', description: '', imageUrl: '' });
      setNotice('Producto añadido al catálogo.');
    } catch { setNotice('No se pudo guardar el producto.'); }
  };

  const sendReply = async event => {
    event.preventDefault();
    if (!reply.trim() || !selectedChat) return;
    try { await sendChatMessage(selectedChat, reply.trim(), 'EcoMarket', user.uid); setReply(''); }
    catch { setNotice('No se pudo enviar la respuesta.'); }
  };

  return <IonPage><IonContent>
    <main className="page-shell admin-shell">
      <Link to="/profile">← Volver a mi perfil</Link>
      <div className="page-intro"><span className="eyebrow">GESTIÓN DE ECOMARKET</span><h1>Panel de administración.</h1><p>Pedidos, productos y atención en un solo lugar.</p></div>
      <div className="admin-stats"><div><small>Pedidos</small><strong>{orders.length}</strong></div><div><small>Pendientes</small><strong>{orders.filter(item => item.status === 'Pendiente').length}</strong></div><div><small>Productos</small><strong>{products.length}</strong></div></div>
      {notice && <p className="notice" role="status">{notice}</p>}
      <div className="filter-row admin-tabs">{[['orders', 'Pedidos'], ['products', 'Productos'], ['chats', 'Mensajes']].map(([key, label]) => <button key={key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{label}</button>)}</div>
      {tab === 'orders' && <div className="admin-list">{orders.length ? orders.map(item => <div className="admin-row" key={item.id}><div><strong>Pedido {item.id.slice(0, 8)}</strong><small>{item.customerName || item.customerEmail}</small><small>{item.address}</small></div><div><b>{money(item.total)}</b><select aria-label={`Estado del pedido ${item.id.slice(0, 8)}`} value={item.status || 'Pendiente'} onChange={event => updateStatus(item.id, event.target.value)}><option>Pendiente</option><option>En camino</option><option>Entregado</option></select></div></div>) : <div className="empty"><p>No hay pedidos registrados.</p></div>}</div>}
      {tab === 'products' && <><form className="admin-product-form" onSubmit={saveProduct}><h2>Nuevo producto</h2><input required placeholder="Nombre" value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /><select value={draft.category} onChange={event => setDraft({ ...draft, category: event.target.value })}><option>Frutas y verduras</option><option>Panadería</option><option>Canastas</option></select><input required type="number" min="1" placeholder="Precio" value={draft.price} onChange={event => setDraft({ ...draft, price: event.target.value })} /><input required placeholder="Unidad" value={draft.unit} onChange={event => setDraft({ ...draft, unit: event.target.value })} /><input required placeholder="Origen" value={draft.origin} onChange={event => setDraft({ ...draft, origin: event.target.value })} /><textarea required placeholder="Descripción" value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} /><input type="url" placeholder="URL de imagen (opcional)" value={draft.imageUrl} onChange={event => setDraft({ ...draft, imageUrl: event.target.value })} /><button className="primary-button">Guardar producto</button></form><div className="admin-list">{products.map(item => <div className="admin-row" key={item.id}><strong>{item.name}</strong><span>{money(item.price)}</span></div>)}</div></>}
      {tab === 'chats' && <div className="admin-chat"><div className="admin-list">{chats.length ? chats.map(item => <button key={item.id} className={selectedChat === item.id ? 'selected' : ''} onClick={() => setSelectedChat(item.id)}>{item.displayName || 'Cliente'}</button>) : <p>No hay conversaciones todavía.</p>}</div>{selectedChat && <><div className="chat-messages">{messages.map(item => <div key={item.id} className={`chat-bubble ${item.senderId === user.uid ? 'mine' : 'support'}`}>{item.text}</div>)}</div><form className="chat-compose" onSubmit={sendReply}><input aria-label="Responder al cliente" value={reply} onChange={event => setReply(event.target.value)} /><button type="submit">Enviar</button></form></>}</div>}
    </main>
  </IonContent></IonPage>;
}
