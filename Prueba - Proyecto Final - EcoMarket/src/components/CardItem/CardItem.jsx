import { IonButton, IonCard, IonCardContent } from '@ionic/react';
import { useCart } from '../../hooks/useCart.js';

export default function CardItem({ product }) {
  const { add } = useCart();
  return <IonCard className="product-card"><IonCardContent>
    <div className="product-emoji">{product.emoji}</div><span className="tag">{product.category}</span>
    <h2>{product.name}</h2><p>{product.description}</p><small>{product.unit}</small>
    <div className="product-footer"><strong>${product.price.toLocaleString('es-CO')}</strong><IonButton size="small" onClick={() => add(product)}>Agregar</IonButton></div>
  </IonCardContent></IonCard>;
}
