import { IonIcon } from '@ionic/react';
import { chatbubbleEllipsesOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';

export default function ChatShortcut() {
  return <Link to="/chat" className="chat-shortcut" aria-label="Abrir chat de EcoMarket"><IonIcon icon={chatbubbleEllipsesOutline} /></Link>;
}
