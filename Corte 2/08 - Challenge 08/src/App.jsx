import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  IonApp,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import {
  addOutline,
  cameraOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  logOutOutline,
  refreshOutline,
  trashOutline,
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { supabase } from './lib/supabase.js';
import { filterTasks, normalizeTaskTitle } from './lib/task-utils.js';

const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'completadas', label: 'Completadas' },
];

function AuthPanel() {
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
            <h1>Una tarea a la vez.</h1>
            <p>Organiza tus pendientes y mantén tu lista sincronizada con Supabase.</p>
            <div className="auth-orbit" aria-hidden="true"><span /><span /><span /></div>
          </section>
          <IonCard className="auth-card">
            <IonCardContent>
              <div className="brand-mark">T</div>
              <p className="eyebrow">TU ESPACIO DE TRABAJO</p>
              <h2>{mode === 'login' ? 'Qué bueno verte' : 'Crea tu cuenta'}</h2>
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

function Avatar({ user, onChange }) {
  const [signedAvatar, setSignedAvatar] = useState({ path: '', url: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const path = user.user_metadata?.avatar_path;

  useEffect(() => {
    let current = true;
    if (!path || !supabase) return () => { current = false; };
    supabase.storage.from('avatars').createSignedUrl(path, 3600).then(({ data }) => {
      if (current) setSignedAvatar({ path, url: data?.signedUrl ?? '' });
    });
    return () => { current = false; };
  }, [path]);
  const url = signedAvatar.path === path ? signedAvatar.url : '';

  async function capturePhoto() {
    setError('');
    try {
      const photo = await Camera.getPhoto({
        quality: 82,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
      });
      if (!photo.webPath || !supabase) return;
      setBusy(true);
      const image = await fetch(photo.webPath).then((response) => response.blob());
      const filePath = `${user.id}/avatar.jpg`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, image, {
        contentType: 'image/jpeg',
        upsert: true,
      });
      if (uploadError) throw uploadError;
      const { error: profileError } = await supabase.auth.updateUser({ data: { avatar_path: filePath } });
      if (profileError) throw profileError;
      await onChange();
    } catch (photoError) {
      if (photoError?.message !== 'User cancelled photos app') setError(photoError.message || 'No se pudo guardar la foto.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="profile-avatar-wrap">
      <IonAvatar className="profile-avatar">{url ? <img src={url} alt="Foto de perfil" /> : <span>{(user.user_metadata?.full_name || user.email || 'U').slice(0, 1).toUpperCase()}</span>}</IonAvatar>
      <IonButton size="small" fill="clear" className="avatar-action" onClick={capturePhoto} disabled={busy} aria-label="Tomar o elegir foto de perfil">
        {busy ? <IonSpinner name="dots" /> : <IonIcon slot="icon-only" icon={cameraOutline} />}
      </IonButton>
      {error && <span className="avatar-error">{error}</span>}
    </div>
  );
}

function TasksPanel({ user, onRefreshSession }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('todas');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const loadTasks = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('tareas')
      .select('id, titulo, completada, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) setToast(`No se pudieron cargar las tareas: ${error.message}`);
    else setTasks(data ?? []);
    setLoading(false);
  }, [user.id]);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) loadTasks(); });
    const channel = supabase?.channel(`tareas-${user.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'tareas', filter: `user_id=eq.${user.id}`,
      }, loadTasks)
      .subscribe();
    return () => {
      active = false;
      if (channel) supabase?.removeChannel(channel);
    };
  }, [loadTasks, user.id]);

  const visibleTasks = useMemo(() => filterTasks(tasks, filter), [tasks, filter]);
  const completedCount = tasks.filter((task) => task.completada).length;
  const displayName = user.user_metadata?.full_name?.trim() || user.email?.split('@')[0] || 'Estudiante';

  async function addTask(event) {
    event.preventDefault();
    const cleanTitle = normalizeTaskTitle(title);
    if (!cleanTitle || !supabase) return;
    setSaving(true);
    const { error } = await supabase.from('tareas').insert({ titulo: cleanTitle, user_id: user.id });
    setSaving(false);
    if (error) setToast(`No se pudo guardar: ${error.message}`);
    else { setTitle(''); await loadTasks(); }
  }

  async function updateTask(task, changes) {
    const { error } = await supabase.from('tareas').update(changes).eq('id', task.id).eq('user_id', user.id);
    if (error) setToast(`No se pudo actualizar: ${error.message}`);
    else await loadTasks();
  }

  async function deleteTask(task) {
    const { error } = await supabase.from('tareas').delete().eq('id', task.id).eq('user_id', user.id);
    if (error) setToast(`No se pudo eliminar: ${error.message}`);
    else await loadTasks();
  }

  return (
    <IonPage>
      <IonToolbar className="topbar">
        <div className="topbar-inner">
          <div className="brand-lockup"><span className="brand-mark small">T</span><span>tarea<span className="brand-dot">.</span></span></div>
          <div className="topbar-user"><span className="user-email">{user.email}</span><IonButton fill="clear" onClick={() => supabase?.auth.signOut()} aria-label="Cerrar sesión"><IonIcon slot="icon-only" icon={logOutOutline} /></IonButton></div>
        </div>
      </IonToolbar>
      <IonContent fullscreen className="tasks-content">
        <main className="dashboard-shell">
          <section className="welcome-row">
            <div><span className="eyebrow">TU TABLERO PERSONAL</span><h1>Hola, {displayName}<span className="brand-dot">.</span></h1><p>Un poco de orden hace espacio para lo que importa.</p></div>
            <Avatar user={user} onChange={onRefreshSession} />
          </section>
          <section className="summary-grid" aria-label="Resumen de tareas">
            <div className="summary-card"><span className="summary-label">Total de tareas</span><strong>{tasks.length.toString().padStart(2, '0')}</strong><span className="summary-hint">En tu lista</span></div>
            <div className="summary-card accent"><span className="summary-label">Completadas</span><strong>{completedCount.toString().padStart(2, '0')}</strong><span className="summary-hint">Vas muy bien</span></div>
            <div className="summary-card"><span className="summary-label">Pendientes</span><strong>{(tasks.length - completedCount).toString().padStart(2, '0')}</strong><span className="summary-hint">A tu ritmo</span></div>
          </section>
          <section className="task-layout">
            <IonCard className="composer-card">
              <IonCardContent>
                <span className="eyebrow">CAPTURA RÁPIDA</span><h2>¿Qué tienes en mente?</h2><p className="muted">Anota el siguiente paso y vuelve a lo que estabas haciendo.</p>
                <form className="task-form" onSubmit={addTask}>
                  <IonItem className="field-item task-input" lines="none"><IonInput label="Nueva tarea" labelPlacement="stacked" placeholder="Ej. Preparar la entrega del viernes" maxlength={120} value={title} onIonInput={(event) => setTitle(event.detail.value ?? '')} required /></IonItem>
                  <IonButton type="submit" className="primary-action add-button" disabled={saving || !title.trim()}><IonIcon slot="start" icon={addOutline} />Agregar tarea</IonButton>
                </form>
              </IonCardContent>
            </IonCard>
            <section className="list-section">
              <div className="list-heading"><div><span className="eyebrow">EN TIEMPO REAL</span><h2>Tu lista</h2></div><IonButton fill="clear" onClick={loadTasks} aria-label="Actualizar tareas"><IonIcon slot="icon-only" icon={refreshOutline} /></IonButton></div>
              <div className="filter-row" role="tablist" aria-label="Filtrar tareas">
                {FILTERS.map((item) => <button key={item.id} type="button" role="tab" aria-selected={filter === item.id} className={filter === item.id ? 'filter-chip selected' : 'filter-chip'} onClick={() => setFilter(item.id)}>{item.label}<span>{item.id === 'todas' ? tasks.length : item.id === 'completadas' ? completedCount : tasks.length - completedCount}</span></button>)}
              </div>
              <div className="task-list-wrap">
                {loading ? <div className="empty-state"><IonSpinner name="crescent" /><p>Cargando tus tareas...</p></div> : visibleTasks.length === 0 ? (
                  <div className="empty-state"><span className="empty-icon"><IonIcon icon={checkmarkCircleOutline} /></span><h3>{filter === 'todas' ? 'Tu lista empieza aquí' : 'Todo al día'}</h3><p>{filter === 'todas' ? 'Agrega una tarea para darle forma a tu día.' : 'No hay tareas en esta categoría.'}</p></div>
                ) : (
                  <IonList className="task-list">
                    {visibleTasks.map((task) => (
                      <IonItem key={task.id} className={task.completada ? 'task-row completed' : 'task-row'} lines="none">
                        <IonCheckbox slot="start" checked={task.completada} onIonChange={(event) => updateTask(task, { completada: event.detail.checked })} aria-label={`Marcar ${task.titulo} como ${task.completada ? 'pendiente' : 'completada'}`} />
                        <IonLabel><span className="task-title">{task.titulo}</span><span className="task-date">{new Date(task.created_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}</span></IonLabel>
                        {task.completada && <IonIcon className="done-icon" icon={checkmarkCircle} />}
                        <IonButton slot="end" fill="clear" color="medium" onClick={() => deleteTask(task)} aria-label={`Eliminar ${task.titulo}`}><IonIcon slot="icon-only" icon={trashOutline} /></IonButton>
                      </IonItem>
                    ))}
                  </IonList>
                )}
              </div>
              <div className="sync-note"><span className="live-dot" />Sincronización activa</div>
            </section>
          </section>
          <footer className="app-footer">Hecho para avanzar, paso a paso <span>✳</span></footer>
        </main>
        <IonToast isOpen={Boolean(toast)} message={toast} duration={3500} onDidDismiss={() => setToast('')} position="bottom" />
      </IonContent>
    </IonPage>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(!supabase);

  useEffect(() => {
    if (!supabase) return undefined;
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  async function refreshSession() {
    const { data } = await supabase.auth.getUser();
    if (data.user) setSession((current) => current ? { ...current, user: data.user } : current);
  }

  if (!ready) return <IonApp><IonPage><IonContent className="loading-screen"><IonSpinner name="crescent" /></IonContent></IonPage></IonApp>;
  return <IonApp>{session ? <TasksPanel user={session.user} onRefreshSession={refreshSession} /> : <AuthPanel />}</IonApp>;
}

export default App;
