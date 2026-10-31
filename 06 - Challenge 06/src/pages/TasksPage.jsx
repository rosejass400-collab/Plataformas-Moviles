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

import { useNavigate } from "react-router-dom";

import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

import { useAuth } from "../hooks/useAuth";
import { useTaskContext } from "../contexts/TaskContext";
import useNetworkStatus from "../hooks/useNetworkStatus";

function TasksPage() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const isOnline = useNetworkStatus();

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
            onClick={() => navigate("/contacts")}
          >
            Contactos
          </IonButton>

          <IonButton
            slot="end"
            fill="clear"
            onClick={() => navigate("/fruits")}
          >
            Frutas
          </IonButton>

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
          {!isOnline && (
            <IonText color="danger">
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  margin: "10px",
                }}
              >
                Sin conexión a Internet. Las acciones de
                tareas están deshabilitadas.
              </p>
            </IonText>
          )}

          <TaskForm
            onAddTask={addTask}
            disabled={!isOnline}
          />

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
              isOnline={isOnline}
            />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default TasksPage;