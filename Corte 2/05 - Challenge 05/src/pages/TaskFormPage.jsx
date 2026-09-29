import { useEffect, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
} from "@ionic/react";

import { useNavigate, useParams } from "react-router-dom";

import { useTaskContext } from "../contexts/TaskContext";

function TaskFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    tasks,
    addTask,
    editTask,
  } = useTaskContext();

  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (!isEditing) {
      setText("");
      return;
    }

    const task = tasks.find((item) => item.id === id);

    if (task) {
      setText(task.text);
    } else {
      setError("No se encontró la tarea.");
    }
  }, [id, isEditing, tasks]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const value = text.trim();

    if (!value) {
      setError("Escribe una tarea.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      if (isEditing) {
        await editTask(id, value);
      } else {
        await addTask({
          text: value,
          completed: false,
        });
      }

      navigate("/tasks");
    } catch (error) {
      console.error("Error al guardar tarea:", error);
      setError("No fue posible guardar la tarea.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            {isEditing ? "Editar tarea" : "Nueva tarea"}
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonInput
              label="Tarea"
              labelPlacement="floating"
              placeholder="Escribe una tarea"
              value={text}
              onIonInput={(event) =>
                setText(event.detail.value || "")
              }
            />
          </IonItem>

          {error && (
            <IonText color="danger">
              <p
                style={{
                  textAlign: "center",
                  margin: "20px 0",
                }}
              >
                {error}
              </p>
            </IonText>
          )}

          <IonButton
            type="submit"
            expand="block"
            disabled={saving}
          >
            {saving
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Agregar tarea"}
          </IonButton>

          <IonButton
            type="button"
            expand="block"
            fill="outline"
            onClick={() => navigate("/tasks")}
            disabled={saving}
          >
            Cancelar
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
}

export default TaskFormPage;