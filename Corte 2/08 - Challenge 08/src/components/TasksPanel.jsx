import { useCallback, useEffect, useMemo, useState } from 'react';
import { IonPage, IonToolbar, IonContent, IonCard, IonCardContent, IonButton, IonIcon, IonItem, IonInput, IonList, IonLabel, IonCheckbox, IonSpinner, IonToast, IonAlert } from '@ionic/react';
import { addOutline, checkmarkCircle, checkmarkCircleOutline, logOutOutline, createOutline, refreshOutline, trashOutline } from 'ionicons/icons';
import { supabase } from '../lib/supabase.js';
import { filterTasks, normalizeTaskTitle } from '../lib/task-utils.js';
import ProfilePhoto from './ProfilePhoto.jsx';

const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendientes', label: 'Pendientes' },
  { id: 'completadas', label: 'Completadas' },
];

// Consulta y modifica únicamente las tareas del usuario conectado.
export default function TasksPanel({ user, onRefreshSession }) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('todas');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [editing, setEditing] = useState(null);
  const [syncStatus, setSyncStatus] = useState('Conectando…');

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
        // DELETE no admite filtros por columnas. El evento solo provoca una
        // nueva consulta, siempre protegida por RLS y filtrada por user_id.
        event: '*', schema: 'public', table: 'tareas',
      }, loadTasks)
      .subscribe((status) => {
        if (active) setSyncStatus(status === 'SUBSCRIBED' ? 'Sincronización activa' : 'Reconectando…');
        if (active && status === 'SUBSCRIBED') loadTasks();
      });
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
          <div className="brand-lockup"><span className="brand-mark small">✓</span><span>Mis pendientes</span></div>
          <div className="topbar-user"><span className="user-email">{user.email}</span><IonButton fill="clear" onClick={() => supabase?.auth.signOut()} aria-label="Cerrar sesión"><IonIcon slot="icon-only" icon={logOutOutline} /></IonButton></div>
        </div>
      </IonToolbar>
      <IonContent fullscreen className="tasks-content">
        <main className="dashboard-shell">
          <section className="welcome-row">
            <div><span className="eyebrow">TU TABLERO PERSONAL</span><h1>Hola, {displayName}<span className="brand-dot">.</span></h1><p>Consulta y organiza las tareas de tu día.</p></div>
            <ProfilePhoto user={user} onChange={onRefreshSession} />
          </section>
          <section className="summary-grid" aria-label="Resumen de tareas">
            <div className="summary-card"><span className="summary-label">Total de tareas</span><strong>{tasks.length.toString().padStart(2, '0')}</strong><span className="summary-hint">En tu lista</span></div>
            <div className="summary-card accent"><span className="summary-label">Completadas</span><strong>{completedCount.toString().padStart(2, '0')}</strong><span className="summary-hint">Actividades terminadas</span></div>
            <div className="summary-card"><span className="summary-label">Pendientes</span><strong>{(tasks.length - completedCount).toString().padStart(2, '0')}</strong><span className="summary-hint">Por realizar</span></div>
          </section>
          <section className="task-layout">
            <IonCard className="composer-card">
              <IonCardContent>
                <span className="eyebrow">AGREGAR PENDIENTE</span><h2>Nueva tarea</h2><p className="muted">Escribe una actividad que necesites realizar.</p>
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
                        <IonButton slot="end" fill="clear" onClick={() => setEditing(task)} aria-label={`Editar ${task.titulo}`}><IonIcon slot="icon-only" icon={createOutline} /></IonButton>
                        <IonButton slot="end" fill="clear" color="medium" onClick={() => deleteTask(task)} aria-label={`Eliminar ${task.titulo}`}><IonIcon slot="icon-only" icon={trashOutline} /></IonButton>
                      </IonItem>
                    ))}
                  </IonList>
                )}
              </div>
              <div className="sync-note"><span className="live-dot" />{syncStatus}</div>
            </section>
          </section>
          <footer className="app-footer">Challenge 08 · Desarrollo de Plataformas Móviles</footer>
        </main>
        <IonToast isOpen={Boolean(toast)} message={toast} duration={3500} onDidDismiss={() => setToast('')} position="bottom" />
        <IonAlert
          isOpen={Boolean(editing)}
          header="Editar tarea"
          inputs={[{ name: 'titulo', type: 'text', value: editing?.titulo || '', placeholder: 'Título de la tarea', attributes: { maxlength: 120, 'aria-label': 'Título de la tarea' } }]}
          buttons={[
            { text: 'Cancelar', role: 'cancel' },
            { text: 'Guardar', handler: (values) => {
              const titulo = normalizeTaskTitle(values.titulo);
              if (!titulo) { setToast('Escribe un título para la tarea.'); return false; }
              if (editing) updateTask(editing, { titulo });
            } },
          ]}
          onDidDismiss={() => setEditing(null)}
        />
      </IonContent>
    </IonPage>
  );
}
