import {
  IonItem,
  IonLabel,
  IonButton,
  IonCheckbox,
} from "@ionic/react";

import { useNavigate } from "react-router-dom";

function TaskItem({ task, onToggleTask, onDeleteTask }) {
  const navigate = useNavigate();

  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onIonChange={() => onToggleTask(task.id)}
      />

      <IonLabel
        style={{
          textDecoration: task.completed
            ? "line-through"
            : "none",
        }}
      >
        {task.text}
      </IonLabel>

      <IonButton
        fill="clear"
        size="small"
        onClick={() => navigate(`/tasks/${task.id}`)}
      >
        Ver
      </IonButton>

      <IonButton
        fill="clear"
        size="small"
        onClick={() =>
          navigate(`/tasks/${task.id}/edit`)
        }
      >
        Editar
      </IonButton>

      <IonButton
        color="danger"
        size="small"
        onClick={() => onDeleteTask(task.id)}
      >
        Eliminar
      </IonButton>
    </IonItem>
  );
}

export default TaskItem;