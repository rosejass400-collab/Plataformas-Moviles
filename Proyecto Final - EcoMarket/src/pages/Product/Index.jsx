import { useState } from 'react';
import { IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowBackOutline, star } from 'ionicons/icons';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../hooks/useCart.js';
import { useProducts } from '../../hooks/useProducts.js';
import { money } from '../../helpers/format.js';
import { marketHero } from '../../data/demoProducts.js';

export default function Product() {
  const { id } = useParams();
  const product = useProducts().find(item => item.id === id);
  const { add } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  if (!product) return <IonPage><IonContent><main className="page-shell"><Link to="/catalog">← Volver al catálogo</Link><p>Producto no encontrado.</p></main></IonContent></IonPage>;
  const addToCart = () => { for (let index = 0; index < quantity; index += 1) add(product); setAdded(true); };
  return <IonPage><IonContent>
    <div className="product-detail">
      <div className="detail-photo"><img src={product.image || product.imageUrl || marketHero} alt={product.name} /><Link to="/catalog" className="back-bubble" aria-label="Volver al catálogo"><IonIcon icon={arrowBackOutline} /></Link></div>
      <main className="page-shell detail-body">
        <span className="eyebrow">{product.category.toUpperCase()}</span>
        <h1>{product.name}</h1>
        <div className="detail-meta"><span>✦ {product.origin}</span><span><IonIcon icon={star} /> {product.rating || '4.8'}</span></div>
        <p>{product.description}</p>
        <div className="producer-card"><span>🌿</span><div><strong>De productores locales</strong><small>Compra consciente, sabor auténtico.</small></div></div>
        <div className="detail-purchase"><div><strong>{money(product.price)}</strong><small>/{product.unit}</small></div><div className="quantity"><button onClick={() => setQuantity(value => Math.max(1, value - 1))} aria-label="Reducir cantidad">−</button><span>{quantity}</span><button onClick={() => setQuantity(value => value + 1)} aria-label="Aumentar cantidad">+</button></div></div>
        <button className="primary-button" onClick={addToCart}>{added ? 'Añadido ✓ · Ver carrito' : 'Agregar a mi canasta'}</button>
        {added && <Link className="after-add" to="/cart">Ir al carrito →</Link>}
      </main>
    </div>
  </IonContent></IonPage>;
}
