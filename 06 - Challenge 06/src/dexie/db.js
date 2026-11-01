import Dexie from "dexie";

const db = new Dexie("Challenge06DB");

db.version(1).stores({
  fruits: "++id, name",
});

export const getFruits = async () => {
  return await db.fruits.toArray();
};

export const newFunction = async (name) => {
  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("El nombre de la fruta es obligatorio.");
  }

  const id = await db.fruits.add({
    name: cleanName,
  });

  return {
    id,
    name: cleanName,
  };
};

export const deleteFruit = async (id) => {
  await db.fruits.delete(id);
};

export default db;