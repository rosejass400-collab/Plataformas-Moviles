import { useCallback, useEffect, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {
  IonApp,
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { auth, firebaseReady } from './firebase.js';
import { calculatePoints, completedCount, EMPTY_MISSIONS, MISSIONS } from './missions.js';
import MissionActions from './MissionActions.jsx';
import { createProfile, useProfile } from './useProfile.js';

export default function App() {
  const [user, setUser] = useState(undefined);
  const [restoredPhoto, setRestoredPhoto] = useState(null);
  const clearRestoredPhoto = useCallback(() => setRestoredPhoto(null), []);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setUser);
  }, []);

  useEffect(() => {
    let active = true;
    let listener;
    CapacitorApp.addListener('appRestoredResult', (result) => {
      if (active && result.pluginId === 'Camera' && result.methodName === 'getPhoto') {
        setRestoredPhoto(result);
      }
    }).then((handle) => {
      if (active) listener = handle;
      else handle.remove();
    });
    return () => {
      active = false;
      listener?.remove();
    };
  }, []);

  if (!firebaseReady) {
    return <Shell><div className="page"><p>Falta configurar Firebase en el archivo .env.</p></div></Shell>;
  }
  if (user === undefined) return <Shell><div className="page"><IonSpinner /> Cargando…</div></Shell>;
  return user
    ? <Dashboard key={user.uid} user={user} restoredPhoto={restoredPhoto} clearRestoredPhoto={clearRestoredPhoto} />
    : <AuthScreen />;
}

function Shell({ children }) {
  return (
    <IonApp>
      <IonPage>
        <IonHeader><IonToolbar><IonTitle>Parcial 2 · Misiones</IonTitle></IonToolbar></IonHeader>
        <IonContent>{children}</IonContent>
      </IonPage>
    </IonApp>
  );
}

function AuthScreen() {
  const [registering, setRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setPending(true);
    setError('');
    try {
      if (registering) {
        const cleanName = name.trim();
        if (cleanName.length < 1 || cleanName.length > 40) throw new Error('Escribe un nombre de 1 a 40 caracteres.');
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(credential.user, { displayName: cleanName });
        await createProfile(credential.user, cleanName);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (cause) {
      setError(authError(cause));
    } finally {
      setPending(false);
    }
  }

  return (
    <Shell>
      <div className="page">
        <section className="panel auth">
          <h1>{registering ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
          <p>Completa misiones reales y guarda tus puntos.</p>
          <form onSubmit={submit}>
            {registering && <label className="form-field"><span>Nombre para el ranking</span><input value={name} onChange={(event) => setName(event.target.value)} maxLength={40} required /></label>}
            <label className="form-field"><span>Correo electrónico</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label>
            <label className="form-field"><span>Contraseña</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={registering ? 'new-password' : 'current-password'} minLength={6} required /></label>
            {error && <p className="status error" role="alert">{error}</p>}
            <div className="form-actions">
              <IonButton type="submit" disabled={pending}>{pending ? 'Espera…' : registering ? 'Registrarme' : 'Entrar'}</IonButton>
              <IonButton type="button" fill="clear" onClick={() => { setRegistering(!registering); setError(''); }}>
                {registering ? 'Ya tengo cuenta' : 'Crear cuenta'}
              </IonButton>
            </div>
          </form>
        </section>
      </div>
    </Shell>
  );
}

function Dashboard({ user, restoredPhoto, clearRestoredPhoto }) {
  const { profile, ranking, error, completeMission } = useProfile(user);
  const [screen, setScreen] = useState('missions');
  const missions = profile?.missions || EMPTY_MISSIONS;
  const count = completedCount(missions);
  const points = calculatePoints(missions);
  const position = ranking.findIndex((person) => person.uid === user.uid) + 1;

  return (
    <Shell>
      <main className="page">
        <div className="topline">
          <div>
            <p className="mission-number">MIS MISIONES</p>
            <h1>Hola, {profile?.displayName || user.displayName || 'usuario'}</h1>
          </div>
          <div className="score"><strong>{points}</strong> pts</div>
        </div>
        <p className="subtitle">Toma una foto, camina y completa el reto de permanecer quieto.</p>

        <section className="panel" aria-label="Progreso">
          <div className="progress-copy"><strong>Progreso</strong><span>{count} de 3 misiones · {Math.round((count / 3) * 100)}%</span></div>
          <IonProgressBar value={count / 3} />
        </section>
        {error && <p className="notice" role="alert">{error}</p>}

        <nav className="tabs" aria-label="Secciones">
          <button className={screen === 'missions' ? 'active' : ''} onClick={() => setScreen('missions')}>Misiones</button>
          <button className={screen === 'results' ? 'active' : ''} onClick={() => setScreen('results')}>Resultados</button>
          <button className={screen === 'ranking' ? 'active' : ''} onClick={() => setScreen('ranking')}>Ranking</button>
        </nav>

        {screen === 'missions' && MISSIONS.map((mission, index) => (
          <section className="panel" key={mission.id}>
            <div className="mission-head">
              <div><p className="mission-number">MISIÓN {index + 1}</p><h2>{mission.title}</h2></div>
              <IonBadge color={missions[mission.id] ? 'success' : 'medium'}>{missions[mission.id] ? 'Completada' : 'Pendiente'}</IonBadge>
            </div>
            <p className="mission-detail">{mission.detail}</p>
            <strong>+{mission.points} puntos</strong>
            <MissionActions
              user={user}
              missionId={mission.id}
              missions={missions}
              completeMission={completeMission}
              restoredPhoto={mission.id === 'photo' ? restoredPhoto : null}
              clearRestoredPhoto={clearRestoredPhoto}
            />
          </section>
        ))}

        {screen === 'results' && <section className="panel">
          <h2>Resultados</h2>
          <p className="result-number">{points}</p><p className="muted">Puntos totales</p>
          <p><strong>Misiones completadas:</strong> {count} de 3</p>
          <p><strong>Estado general:</strong> {count === 3 ? 'Reto completado' : count > 0 ? 'En progreso' : 'Sin iniciar'}</p>
        </section>}

        {screen === 'ranking' && <section className="panel">
          <h2>Ranking</h2>
          <p className="muted">Cinco mejores puntajes de usuarios registrados.</p>
          <ol className="ranking">
            {ranking.slice(0, 5).map((person, index) => (
              <li key={person.uid} className={person.uid === user.uid ? 'mine' : ''}>
                <span>{index + 1}. {person.displayName}{person.uid === user.uid ? ' (tú)' : ''}</span>
                <span>{person.points} pts</span>
              </li>
            ))}
          </ol>
          {ranking.length < 5 && <p className="status">Aparecerán más posiciones cuando otros usuarios se registren.</p>}
          {position > 5 && <p>Tu posición: {position} · {points} puntos</p>}
        </section>}

        <div className="app-footer"><IonButton fill="clear" onClick={() => signOut(auth)}>Cerrar sesión</IonButton></div>
      </main>
    </Shell>
  );
}

function authError(error) {
  const messages = {
    'auth/email-already-in-use': 'Este correo ya tiene una cuenta.',
    'auth/invalid-email': 'Revisa el correo electrónico.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
  };
  return messages[error.code] || error.message || 'No se pudo continuar.';
}
