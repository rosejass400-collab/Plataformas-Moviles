// La evidencia queda en el almacenamiento privado de la app, no en Firestore.
export async function savePhoto(uid, base64, format) {
  const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  const blob = new Blob([bytes], { type: `image/${format}` });
  const database = await new Promise((resolve, reject) => {
    const request = indexedDB.open('misiones-evidencias', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('photos');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  try {
    await new Promise((resolve, reject) => {
      const transaction = database.transaction('photos', 'readwrite');
      transaction.objectStore('photos').put(blob, uid);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}
