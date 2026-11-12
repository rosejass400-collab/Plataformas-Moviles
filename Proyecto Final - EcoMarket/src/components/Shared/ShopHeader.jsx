import { IonIcon } from '@ionic/react';
import { leafOutline, locationOutline, personCircleOutline } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

export default function ShopHeader() {
  const { user } = useAuth();
  return <div className="shop-header">
    <Link to="/home" className="brand"><span className="brand-mark"><IonIcon icon={leafOutline} /></span><span>Eco<span>Market</span></span></Link>
    <div className="delivery-label"><IonIcon icon={locationOutline} /><span>Entrega en <strong>Bogotá</strong></span></div>
    <Link to="/profile" className="header-avatar" aria-label="Mi perfil">{user?.displayName?.[0]?.toUpperCase() || <IonIcon icon={personCircleOutline} />}</Link>
  </div>;
}
