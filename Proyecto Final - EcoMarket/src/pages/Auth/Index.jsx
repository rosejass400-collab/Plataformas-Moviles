import { useState } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { explainFirebaseError } from '../../helpers/firebaseErrors.js';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, firebaseEnabled } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async event => {
    event.preventDefault();
    if (busy) return;
    if (mode === 'register' && !name.trim()) {
      setError('Escribe tu nombre.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (mode === 'register') await register(name, email, password);
      else await login(email, password);
      navigate('/profile', { replace: true });
    } catch (authError) {
      setError(explainFirebaseError(authError));
    } finally { setBusy(false); }
  };

  return <IonPage>
    <IonHeader><IonToolbar><IonTitle>EcoMarket</IonTitle></IonToolbar></IonHeader>
    <IonContent>
      <div className="page-shell auth-shell">
        <div className="eyebrow">BIENVENIDO A ECOMARKET</div>
        <h1>{mode === 'login' ? 'Qué bueno verte de nuevo.' : 'Empieza a comprar local.'}</h1>
        <p>Productos de aquí, elegidos con cuidado para ti.</p>
        <div className="auth-switch" role="tablist" aria-label="Acceso">
          <button className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setError(''); }}>Iniciar sesión</button>
          <button className={mode === 'register' ? 'selected' : ''} onClick={() => { setMode('register'); setError(''); }}>Crear cuenta</button>
        </div>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && <label>Nombre completo<input autoComplete="name" value={name} onChange={event => setName(event.target.value)} required /></label>}
          <label>Correo electrónico<input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required /></label>
          <label>Contraseña<input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={6} value={password} onChange={event => setPassword(event.target.value)} required /></label>
          {error && <p className="error" role="alert">{error}</p>}
          {!firebaseEnabled && <p className="error">La conexión con Firebase no está configurada.</p>}
          <IonButton expand="block" type="submit" disabled={busy || !firebaseEnabled}>{busy ? 'Espera un momento…' : mode === 'login' ? 'Entrar a mi cuenta' : 'Crear mi cuenta'}</IonButton>
        </form>
      </div>
    </IonContent>
  </IonPage>;
}
