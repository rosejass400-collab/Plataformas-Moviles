import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

import { useAuth } from "../hooks/useAuth";
import { useTaskContext } from "../contexts/TaskContext";

function TasksPage() {
  const { logout } = useAuth();

  const {
    tasks,
    loading,
    error,
    addTask,
    toggleTask,
    deleteTask,
  } = useTaskContext();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Administrador de Tareas</IonTitle>

          <IonButton
            slot="end"
            fill="clear"
            onClick={logout}
          >
            Cerrar sesión
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div className="app">
          <TaskForm onAddTask={addTask} />

          {loading && (
            <div
              style={{
                textAlign: "center",
                margin: "30px",
              }}
            >
              <IonSpinner name="crescent" />

              <IonText>
                <p>Cargando tareas...</p>
              </IonText>
            </div>
          )}

          {!loading && error && (
            <IonText color="danger">
              <p
                style={{
                  textAlign: "center",
                  margin: "20px",
                }}
              >
                {error}
              </p>
            </IonText>
          )}

          {!loading && !error && (
            <TaskList
              tasks={tasks}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
            />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default TasksPage;