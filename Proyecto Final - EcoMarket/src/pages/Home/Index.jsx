import { IonContent, IonPage } from '@ionic/react';
import { Link } from 'react-router-dom';
import CardItem from '../../components/CardItem/CardItem.jsx';
import ChatShortcut from '../../components/Shared/ChatShortcut.jsx';
import ShopHeader from '../../components/Shared/ShopHeader.jsx';
import { marketHero, categories } from '../../data/demoProducts.js';
import { useProducts } from '../../hooks/useProducts.js';
import { useAuth } from '../../hooks/useAuth.js';
import { shortName } from '../../helpers/format.js';
import styles from './Index.module.scss';

export default function Home() {
  const { user } = useAuth();
  const products = useProducts();
  return <IonPage>
    <IonContent>
      <ShopHeader />
      <main className="page-shell">
        <div className={styles.greeting}><span>UN MERCADO MÁS CERCANO</span><h1>Hola, {shortName(user)}<b>.</b></h1><p>Descubre lo mejor de nuestra tierra.</p></div>
        <Link to="/catalog" className="search-box" aria-label="Buscar productos"><span>⌕</span> Busca algo delicioso y local...</Link>
        <section className={styles.hero}>
          <div><span>FRESCO · LOCAL · CONSCIENTE</span><h2>Lo local nos conecta.</h2><p>Sabores de nuestra tierra, directo a tu hogar.</p><Link to="/catalog">Explorar productos →</Link></div>
          <img src={marketHero} alt="Frutas, verduras y pan de productores locales" />
        </section>
        <div className="section-heading"><div><span className="eyebrow">ENCUENTRA TU FAVORITO</span><h2>Explora por categoría</h2></div></div>
        <div className={styles.categories}>{categories.slice(1).map((category, index) => <Link to={`/catalog?category=${encodeURIComponent(category)}`} key={category}><span>{['🥬', '🥖', '🧺'][index]}</span>{category}</Link>)}</div>
        <div className="section-heading"><div><span className="eyebrow">HECHO CON CARIÑO</span><h2>Para ti, esta semana</h2></div><Link to="/catalog">Ver todos →</Link></div>
        <div className="product-grid">{products.slice(0, 4).map(product => <CardItem key={product.id} product={product} />)}</div>
        <div className={styles.promise}><strong>Comer bien también es apoyar lo nuestro.</strong><p>Compra productos locales y descubre quién está detrás de cada alimento.</p></div>
      </main>
      <ChatShortcut />
    </IonContent>
  </IonPage>;
}
