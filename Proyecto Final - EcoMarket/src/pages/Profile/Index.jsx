import { useState } from 'react';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { arrowForwardOutline, locationOutline, receiptOutline, settingsOutline, storefrontOutline, logOutOutline } from 'ionicons/icons';
import { Link, useNavigate } from 'react-router-dom';
import ShopHeader from '../../components/Shared/ShopHeader.jsx';
import { useAuth } from '../../hooks/useAuth.js';

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const [savedPhoto, setSavedPhoto] = useState({ uid: '', value: '' });
  const [photoError, setPhotoError] = useState('');
  const navigate = useNavigate();
  const photo = user ? (savedPhoto.uid === user.uid ? savedPhoto.value : localStorage.getItem(`ecomarket-profile-photo-${user.uid}`) || '') : '';
  const leave = async () => { await logout(); navigate('/home', { replace: true }); };
  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({ source: CameraSource.Camera, resultType: CameraResultType.DataUrl, quality: 55, width: 320 });
      if (image.dataUrl) { localStorage.setItem(`ecomarket-profile-photo-${user.uid}`, image.dataUrl); setSavedPhoto({ uid: user.uid, value: image.dataUrl }); setPhotoError(''); }
    } catch (error) { if (!String(error?.message || '').toLowerCase().includes('cancel')) setPhotoError('No se pudo guardar la foto en este dispositivo.'); }
  };
  return <IonPage><IonContent>
    <ShopHeader />
    <main className="page-shell">
      <div className="page-intro"><span className="eyebrow">TU ESPACIO</span><h1>Mi pequeño impacto.</h1><p>Cada elección suma para nuestra comunidad.</p></div>
      {user ? <>
        <div className="account-card"><button className="account-avatar photo-button" onClick={takePhoto} aria-label="Tomar foto de perfil">{photo ? <img src={photo} alt="Foto de perfil" /> : (user.displayName || user.email || 'E')[0].toUpperCase()}</button><div><strong>{user.displayName || 'Mi cuenta'}</strong><small>{user.email}</small><small>Toca tu foto para cambiarla</small></div></div>
        {photoError && <p className="error">{photoError}</p>}
        <div className="profile-menu">
          <Link to="/orders"><IonIcon icon={receiptOutline} /><span>Mis pedidos<small>Revisa tus compras</small></span><IonIcon icon={arrowForwardOutline} /></Link>
          <Link to="/addresses"><IonIcon icon={locationOutline} /><span>Direcciones de entrega<small>Administra tus destinos</small></span><IonIcon icon={arrowForwardOutline} /></Link>
          <Link to="/native"><IonIcon icon={settingsOutline} /><span>Funciones del celular<small>Cámara y sensores</small></span><IonIcon icon={arrowForwardOutline} /></Link>
          {isAdmin && <Link to="/admin"><IonIcon icon={storefrontOutline} /><span>Administración<small>Pedidos y catálogo</small></span><IonIcon icon={arrowForwardOutline} /></Link>}
        </div>
        <button className="logout-button" onClick={leave}><IonIcon icon={logOutOutline} /> Cerrar sesión</button>
      </> : <div className="guest-card"><div className="account-avatar">🌿</div><h2>Un mercado más cercano empieza aquí.</h2><p>Crea tu cuenta para guardar direcciones, pedidos y conversaciones.</p><Link to="/auth" className="primary-button">Iniciar sesión o registrarme</Link></div>}
    </main>
  </IonContent></IonPage>;
}
