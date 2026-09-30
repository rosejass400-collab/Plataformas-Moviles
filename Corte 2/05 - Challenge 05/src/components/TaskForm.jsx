import { useState } from "react";
import {
  IonInput,
  IonButton,
  IonItem,
} from "@ionic/react";

function TaskForm({ onAddTask }) {
  const [task, setTask] = useState("");

  const handleAddTask = async () => {
    const text = task.trim();

    if (!text) {
      return;
    }

    console.log("1. Tarea que se va a guardar:", text);

    const newTask = {
      text: text,
      completed: false,
    };

    try {
      await onAddTask(newTask);

      console.log("2. Tarea enviada correctamente");

      setTask("");
    } catch (error) {
      console.error("3. Error al agregar tarea:", error);
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
          onIonChange={(event) => {
            setTask(event.detail.value || "");
          }}
        />
      </IonItem>

      <IonButton
        expand="block"
        onClick={handleAddTask}
      >
        Agregar tarea
      </IonButton>
    </div>
  );
}

export default TaskForm;