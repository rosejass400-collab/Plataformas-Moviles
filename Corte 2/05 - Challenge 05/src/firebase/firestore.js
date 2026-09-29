import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { getFirestore } from "firebase/firestore";
import app from "./config";

const db = getFirestore(app);

const tasksCollection = collection(db, "tasks");

export const getTasks = async () => {
  const snapshot = await getDocs(tasksCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
};

export const createTask = async (task) => {
  const document = await addDoc(tasksCollection, task);

  return {
    id: document.id,
    ...task,
  };
};

export const updateTask = async (id, data) => {
  const taskRef = doc(db, "tasks", id);

  await updateDoc(taskRef, data);
};

export const removeTask = async (id) => {
  const taskRef = doc(db, "tasks", id);

  await deleteDoc(taskRef);
};
