import { useEffect, useState } from 'react';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowBackOutline, sendOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { subscribeToChat, sendChatMessage } from '../../services/chatService.js';
import { useAuth } from '../../hooks/useAuth.js';

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return undefined;
    return subscribeToChat(user.uid, setMessages, () => setError('No fue posible sincronizar la conversación.'));
  }, [user]);

  const send = async event => {
    event.preventDefault();
    if (!text.trim() || !user || busy) return;
    setBusy(true);
    try { await sendChatMessage(user.uid, text.trim(), user.displayName || user.email); setText(''); setError(''); }
    catch { setError('No se pudo enviar el mensaje. Revisa tu conexión.'); }
    finally { setBusy(false); }
  };

  return <IonPage><IonContent>
    <div className="chat-page">
      <div className="chat-top"><Link to="/home" aria-label="Volver"><IonIcon icon={arrowBackOutline} /></Link><div className="chat-face">🌿</div><div><strong>EcoMarket contigo</strong><small>Escríbenos cuando lo necesites</small></div></div>
      <div className="chat-messages">
        <div className="chat-bubble support">¡Hola! Cuéntanos en qué podemos ayudarte.</div>
        {messages.map(item => <div key={item.id} className={`chat-bubble ${item.senderId === user?.uid ? 'mine' : 'support'}`}>{item.text}</div>)}
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <form className="chat-compose" onSubmit={send}><input aria-label="Escribe un mensaje" placeholder="Escribe tu mensaje..." value={text} onChange={event => setText(event.target.value)} /><button type="submit" disabled={busy || !text.trim()} aria-label="Enviar mensaje"><IonIcon icon={sendOutline} /></button></form>
    </div>
  </IonContent></IonPage>;
}
