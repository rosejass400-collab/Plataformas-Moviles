import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.js';
export function subscribeToChat(uid, callback, onError) {
  return onSnapshot(query(collection(db, 'chats', uid, 'messages'), orderBy('createdAt')), snapshot => callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))), onError);
}
export function sendChatMessage(uid, text, senderName) {
  return addDoc(collection(db, 'chats', uid, 'messages'), { text, senderId: uid, senderName, createdAt: serverTimestamp() });
}