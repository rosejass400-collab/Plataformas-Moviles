import { useEffect, useMemo, useState } from 'react';
import { CartContext } from './CartContext.js';

const CART_KEY = 'ecomarket-cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem(CART_KEY) || '[]'));
  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(items)), [items]);
  const value = useMemo(() => ({
    items,
    count: items.reduce((total, item) => total + item.quantity, 0),
    total: items.reduce((total, item) => total + item.price * item.quantity, 0),
    add(product) { setItems(current => { const found = current.find(item => item.id === product.id); return found ? current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { ...product, quantity: 1 }]; }); },
    update(id, quantity) { setItems(current => current.flatMap(item => item.id === id && quantity <= 0 ? [] : item.id === id ? [{ ...item, quantity }] : [item])); },
    clear() { setItems([]); },
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
