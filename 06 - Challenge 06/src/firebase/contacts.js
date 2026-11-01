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

const contactsRef = ref(db, "contacts");

export const getContacts = async () => {
  const snapshot = await get(contactsRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.entries(data).map(([id, contact]) => ({
    id,
    ...contact,
  }));
};

export const createContact = async (contact) => {
  const newContactRef = push(contactsRef);

  await set(newContactRef, contact);

  return {
    id: newContactRef.key,
    ...contact,
  };
};

export const updateContact = async (id, data) => {
  const contactRef = ref(db, `contacts/${id}`);

  await update(contactRef, data);
};

export const removeContact = async (id) => {
  const contactRef = ref(db, `contacts/${id}`);

  await remove(contactRef);
};