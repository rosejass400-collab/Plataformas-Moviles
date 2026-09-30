import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { useParams } from "react-router-dom";

import { useTaskContext } from "../contexts/TaskContext";

function TaskDetailPage() {
  const { id } = useParams();

  const { tasks } = useTaskContext();

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tasks" />
            </IonButtons>

            <IonTitle>Detalle de tarea</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <IonText color="danger">
            <h2>Tarea no encontrada</h2>
          </IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>

          <IonTitle>Detalle de tarea</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <IonText>
            <h2
              style={{
                color: "#444444",
                fontWeight: "600",
              }}
            >
              {task.text}
            </h2>
          </IonText>

          <IonText>
            <p>
              Estado:{" "}
              {task.completed
                ? "Completada"
                : "Pendiente"}
            </p>
          </IonText>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default TaskDetailPage;