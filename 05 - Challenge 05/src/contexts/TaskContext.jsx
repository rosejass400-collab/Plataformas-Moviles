import { createContext, useContext, useEffect, useState } from "react";

import {
  getTasks,
  createTask,
  updateTask,
  removeTask,
} from "../firebase/firestore";

import { useAuth } from "../hooks/useAuth";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTasks = async () => {
      if (!user) {
        setTasks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const tasksFromFirebase = await getTasks();

        setTasks(tasksFromFirebase);
      } catch (error) {
        console.error("Error al cargar las tareas:", error);
        setError("No fue posible cargar las tareas.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [user]);

  const addTask = async (task) => {
    try {
      setError("");

      const savedTask = await createTask({
        text: task.text,
        completed: false,
      });

      setTasks((currentTasks) => [
        ...currentTasks,
        savedTask,
      ]);

      return savedTask;
    } catch (error) {
      console.error("Error al agregar tarea:", error);
      setError("No fue posible guardar la tarea.");
      throw error;
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((item) => item.id === id);

    if (!task) {
      return;
    }

    const newCompleted = !task.completed;

    try {
      setError("");

      await updateTask(id, {
        completed: newCompleted,
      });

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === id
            ? {
                ...item,
                completed: newCompleted,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      setError("No fue posible actualizar la tarea.");
      throw error;
    }
  };

  const editTask = async (id, text) => {
    try {
      setError("");

      await updateTask(id, {
        text,
      });

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === id
            ? {
                ...item,
                text,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Error al editar tarea:", error);
      setError("No fue posible editar la tarea.");
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      setError("");

      await removeTask(id);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      setError("No fue posible eliminar la tarea.");
      throw error;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        addTask,
        toggleTask,
        editTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  return useContext(TaskContext);
}

export default TaskContext;