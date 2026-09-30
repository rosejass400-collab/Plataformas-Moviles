import {
  getDatabase,
  ref,
  push,
  get,
  set,
  update,
  remove,
} from "firebase/database";

import app from "./config";

const db = getDatabase(app);

const tasksRef = ref(db, "tasks");

export const getTasks = async () => {
  const snapshot = await get(tasksRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(([id, task]) => ({
    id,
    ...task,
  }));
};

export const createTask = async (task) => {
  const newTaskRef = push(tasksRef);

  await set(newTaskRef, {
    text: task.text,
    completed: task.completed ?? false,
  });

  return {
    id: newTaskRef.key,
    text: task.text,
    completed: task.completed ?? false,
  };
};

export const updateTask = async (id, data) => {
  const taskRef = ref(db, `tasks/${id}`);

  await update(taskRef, data);
};

export const removeTask = async (id) => {
  const taskRef = ref(db, `tasks/${id}`);

  await remove(taskRef);
};