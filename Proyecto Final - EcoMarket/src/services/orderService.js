import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.js';
export async function createOrder(user, items, total, address) {
  const orderRef = doc(collection(db, 'orders'));
  await runTransaction(db, async transaction => {
    transaction.set(orderRef, { uid: user.uid, customerEmail: user.email || '', customerName: user.displayName || user.email || 'Cliente', items: items.map(({id,name,price,quantity})=>({id,name,price,quantity})), total, address: address.trim(), status: 'Pendiente', createdAt: serverTimestamp() });
  });
  return orderRef.id;
}
