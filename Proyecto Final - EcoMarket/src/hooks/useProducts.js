import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase.js';
import { demoProducts } from '../data/demoProducts.js';

export function useProducts() {
  const [products, setProducts] = useState(demoProducts);
  useEffect(() => {
    if (!db) return undefined;
    return onSnapshot(collection(db, 'products'), snapshot => {
      const remote = snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
      const overrides = new Map(remote.map(item => [item.id, item]));
      setProducts([...demoProducts.map(item => ({ ...item, ...overrides.get(item.id) })), ...remote.filter(item => !demoProducts.some(base => base.id === item.id))].filter(item => item.active !== false));
    }, () => setProducts(demoProducts));
  }, []);
  return products;
}
