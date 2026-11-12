import { IonIcon } from '@ionic/react';
import { addOutline, star } from 'ionicons/icons';
import { Link } from 'react-router-dom';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useCart } from '../../hooks/useCart.js';
import { money } from '../../helpers/format.js';
import { marketHero } from '../../data/demoProducts.js';
import styles from './CardItem.module.scss';

export default function CardItem({ product }) {
  const { add } = useCart();
  const addProduct = () => { add(product); void Haptics.impact({ style: ImpactStyle.Light }).catch(() => {}); };
  return <article className={styles.card}>
    <Link to={`/product/${product.id}`} className={styles.imageLink} aria-label={`Ver ${product.name}`}>
      <img src={product.image || product.imageUrl || marketHero} alt={product.name} loading="lazy" />
      <span className={styles.badge}>Local</span>
    </Link>
    <div className={styles.body}>
      <div className={styles.meta}><span>{product.origin}</span><span><IonIcon icon={star} /> {product.rating || '4.8'}</span></div>
      <Link to={`/product/${product.id}`} className={styles.name}>{product.name}</Link>
      <small>{product.unit}</small>
      <div className={styles.footer}><strong>{money(product.price)}</strong><button type="button" onClick={addProduct} aria-label={`Agregar ${product.name} al carrito`}><IonIcon icon={addOutline} /></button></div>
    </div>
  </article>;
}
