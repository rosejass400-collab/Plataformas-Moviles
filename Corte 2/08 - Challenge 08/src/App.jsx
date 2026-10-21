import { useEffect, useState } from 'react';
import { IonApp, IonPage, IonContent, IonSpinner } from '@ionic/react';
import { supabase } from './lib/supabase.js';
import AuthPanel from './components/AuthPanel.jsx';
import TasksPanel from './components/TasksPanel.jsx';

// La sesión determina si se muestra el formulario o el tablero de tareas.
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
