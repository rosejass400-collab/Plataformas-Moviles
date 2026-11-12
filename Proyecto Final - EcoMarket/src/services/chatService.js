import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export function subscribeToChat(uid, callback, onError) {
  return onSnapshot(query(collection(db, 'chats', uid, 'messages'), orderBy('createdAt')), snapshot => callback(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))), onError);
}

export async function sendChatMessage(uid, text, senderName, senderId = uid) {
  if (senderId === uid) await setDoc(doc(db, 'chats', uid), { uid, displayName: senderName, updatedAt: serverTimestamp() }, { merge: true });
  return addDoc(collection(db, 'chats', uid, 'messages'), { text, senderId, senderName, createdAt: serverTimestamp() });
}
