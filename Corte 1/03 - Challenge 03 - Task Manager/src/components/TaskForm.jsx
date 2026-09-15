import { useState } from "react";
import {
  IonInput,
  IonButton,
  IonItem,
} from "@ionic/react";

function TaskForm({ onAddTask }) {
  const [task, setTask] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (task.trim() === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
    };

    onAddTask(newTask);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <IonItem>
        <IonInput
          label="Nueva tarea"
          labelPlacement="floating"
          placeholder="Escribe una tarea"
          value={task}
          onIonInput={(event) =>
            setTask(event.detail.value || "")
          }
        />
      </IonItem>

      <IonButton type="submit" expand="block">
        Agregar tarea
      </IonButton>
    </form>
  );
}

export default TaskForm;