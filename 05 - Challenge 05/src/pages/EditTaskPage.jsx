import {
  IonBackButton,
  IonButtons,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
} from "@ionic/react";

import { useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useTaskContext } from "../contexts/TaskContext";

function EditTaskPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    tasks,
    editTask,
  } = useTaskContext();

  const task = tasks.find(
    (item) => item.id === id
  );

  const [text, setText] = useState(
    task ? task.text : ""
  );

  const [saving, setSaving] = useState(false);

  if (!task) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tasks" />
            </IonButtons>

            <IonTitle>Editar tarea</IonTitle>
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

  const handleSave = async () => {
    const newText = text.trim();

    if (!newText) {
      return;
    }

    try {
      setSaving(true);

      await editTask(id, newText);

      navigate("/tasks");
    } catch (error) {
      console.error(
        "Error al guardar la tarea:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" />
          </IonButtons>

          <IonTitle>Editar tarea</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonInput
          label="Tarea"
          labelPlacement="stacked"
          value={text}
          onIonInput={(event) =>
            setText(event.detail.value ?? "")
          }
          fill="outline"
          style={{
            "--color": "#444444",
            "--placeholder-color": "#666666",
          }}
        />

        <IonButton
          expand="block"
          onClick={handleSave}
          disabled={saving || !text.trim()}
          style={{
            marginTop: "20px",
          }}
        >
          {saving
            ? "GUARDANDO..."
            : "GUARDAR CAMBIOS"}
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default EditTaskPage;