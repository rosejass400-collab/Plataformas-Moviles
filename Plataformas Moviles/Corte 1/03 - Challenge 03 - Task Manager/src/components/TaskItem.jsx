import {
  IonItem,
  IonLabel,
  IonButton,
  IonCheckbox,
} from "@ionic/react";

function TaskItem({ task, onToggleTask, onDeleteTask }) {
  return (
    <IonItem>
      <IonCheckbox
        slot="start"
        checked={task.completed}
        onIonChange={() => onToggleTask(task.id)}
      />

      <IonLabel
        style={{
          textDecoration: task.completed ? "line-through" : "none",
        }}
      >
        {task.text}
      </IonLabel>

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