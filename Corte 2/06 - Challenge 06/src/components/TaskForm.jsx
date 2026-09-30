import { useState } from "react";

import {
  IonInput,
  IonButton,
  IonItem,
} from "@ionic/react";

function TaskForm({ onAddTask, disabled = false }) {
  const [task, setTask] = useState("");

  const handleAddTask = async () => {
    const text = task.trim();

    if (!text || disabled) {
      return;
    }

    const newTask = {
      text,
      completed: false,
    };

    try {
      await onAddTask(newTask);

      setTask("");
    } catch (error) {
      console.error(
        "Error al agregar tarea:",
        error
      );
    }
  };

  return (
    <div>
      <IonItem>
        <IonInput
          label="Nueva tarea"
          labelPlacement="floating"
          placeholder="Escribe una tarea"
          value={task}
          disabled={disabled}
          onIonChange={(event) => {
            setTask(event.detail.value || "");
          }}
        />
      </IonItem>

      <IonButton
        expand="block"
        disabled={disabled}
        onClick={handleAddTask}
      >
        Agregar tarea
      </IonButton>
    </div>
  );
}

export default TaskForm;