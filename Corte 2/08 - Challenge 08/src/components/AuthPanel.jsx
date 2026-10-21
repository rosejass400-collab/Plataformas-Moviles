import { useState } from 'react';
import { IonPage, IonContent, IonCard, IonCardContent, IonItem, IonInput, IonButton, IonSpinner } from '@ionic/react';
import { supabase } from '../lib/supabase.js';

// Formulario de registro e inicio de sesión con Supabase Auth.
export default function AuthPanel() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setNotice('');
    const result = mode === 'register'
      ? await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (result.error) {
      setNotice(result.error.message);
    } else if (mode === 'register' && !result.data.session) {
      setNotice('Revisa tu correo y confirma la cuenta para poder iniciar sesión.');
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen className="auth-content">
        <main className="auth-layout">
          <section className="auth-copy">
            <span className="eyebrow">DESARROLLO DE PLATAFORMAS MÓVILES · CHALLENGE 08</span>
            <h1>Mis pendientes</h1>
            <p>Guarda tus tareas, marca lo que terminas y consulta tus pendientes desde cualquier dispositivo.</p>

          </section>
          <IonCard className="auth-card">
            <IonCardContent>
              <div className="brand-mark">MP</div>
              <p className="eyebrow">TU ESPACIO DE TRABAJO</p>
              <h2>{mode === 'login' ? 'Iniciar sesión' : 'Crea tu cuenta'}</h2>
              <p className="muted">{mode === 'login' ? 'Inicia sesión para continuar.' : 'Regístrate con tu correo institucional o personal.'}</p>
              {!supabase && <p className="config-warning">Configura las variables de Supabase en el archivo <code>.env</code> para habilitar el acceso.</p>}
              <form onSubmit={submit} className="auth-form">
                {mode === 'register' && (
                  <IonItem className="field-item" lines="none">
                    <IonInput label="Nombre" labelPlacement="stacked" autocomplete="name" value={name} onIonInput={(event) => setName(event.detail.value ?? '')} required />
                  </IonItem>
                )}
                <IonItem className="field-item" lines="none">
                  <IonInput label="Correo electrónico" labelPlacement="stacked" type="email" autocomplete="email" value={email} onIonInput={(event) => setEmail(event.detail.value ?? '')} required />
                </IonItem>
                <IonItem className="field-item" lines="none">
                  <IonInput label="Contraseña" labelPlacement="stacked" type="password" autocomplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onIonInput={(event) => setPassword(event.detail.value ?? '')} minlength={6} required />
                </IonItem>
                {notice && <p className="form-notice" role="status">{notice}</p>}
                <IonButton className="primary-action" type="submit" expand="block" disabled={!supabase || busy}>
                  {busy ? <IonSpinner name="crescent" /> : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
                </IonButton>
              </form>
              <p className="auth-switch">
                {mode === 'login' ? '¿Todavía no tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setNotice(''); }}>
                  {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
                </button>
              </p>
            </IonCardContent>
          </IonCard>
        </main>
      </IonContent>
    </IonPage>
  );
}
