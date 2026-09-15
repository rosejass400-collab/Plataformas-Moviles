import { IonList, IonText } from "@ionic/react";
import TaskItem from "./TaskItem";

function TaskList({ tasks, onToggleTask, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <IonText>
        <p className="empty-message">No hay tareas pendientes.</p>
      </IonText>
    );
  }

  return (
    <IonList>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </IonList>
  );
}

export default TaskList;