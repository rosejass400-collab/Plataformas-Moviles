import { IonBadge, IonIcon, IonTabBar, IonTabButton } from '@ionic/react';
import { cartOutline, chatbubbleOutline, homeOutline, mapOutline, personOutline } from 'ionicons/icons';
import { useCart } from '../../hooks/useCart.js';
export default function Menu() { const { count } = useCart(); return <IonTabBar slot="bottom">
  <IonTabButton tab="home" href="/home"><IonIcon icon={homeOutline}/><span>Inicio</span></IonTabButton>
  <IonTabButton tab="map" href="/map"><IonIcon icon={mapOutline}/><span>Mapa</span></IonTabButton>
  <IonTabButton tab="cart" href="/cart"><IonIcon icon={cartOutline}/>{count > 0 && <IonBadge>{count}</IonBadge>}<span>Carrito</span></IonTabButton>
  <IonTabButton tab="chat" href="/chat"><IonIcon icon={chatbubbleOutline}/><span>Chat</span></IonTabButton>
  <IonTabButton tab="profile" href="/profile"><IonIcon icon={personOutline}/><span>Perfil</span></IonTabButton>
</IonTabBar>; }
