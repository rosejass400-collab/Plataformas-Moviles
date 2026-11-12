import { IonBadge, IonIcon, IonTabBar, IonTabButton } from '@ionic/react';
import { cartOutline, gridOutline, homeOutline, mapOutline, personOutline } from 'ionicons/icons';
import { useCart } from '../../hooks/useCart.js';
import styles from './Menu.module.scss';
export default function Menu() { const { count } = useCart(); return <IonTabBar slot="bottom" className={styles.menu}>
  <IonTabButton tab="home" href="/home"><IonIcon icon={homeOutline}/><span>Inicio</span></IonTabButton>
  <IonTabButton tab="catalog" href="/catalog"><IonIcon icon={gridOutline}/><span>Catálogo</span></IonTabButton>
  <IonTabButton tab="cart" href="/cart"><IonIcon icon={cartOutline}/>{count > 0 && <IonBadge>{count}</IonBadge>}<span>Carrito</span></IonTabButton>
  <IonTabButton tab="map" href="/map"><IonIcon icon={mapOutline}/><span>Mapa</span></IonTabButton>
  <IonTabButton tab="profile" href="/profile"><IonIcon icon={personOutline}/><span>Perfil</span></IonTabButton>
</IonTabBar>; }
