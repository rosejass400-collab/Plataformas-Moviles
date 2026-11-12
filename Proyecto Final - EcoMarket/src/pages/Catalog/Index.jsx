import { useMemo, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useLocation } from 'react-router-dom';
import CardItem from '../../components/CardItem/CardItem.jsx';
import ChatShortcut from '../../components/Shared/ChatShortcut.jsx';
import ShopHeader from '../../components/Shared/ShopHeader.jsx';
import { categories } from '../../data/demoProducts.js';
import { useProducts } from '../../hooks/useProducts.js';

export default function Catalog() {
  const location = useLocation();
  const selectedFromUrl = new URLSearchParams(location.search).get('category');
  const [categorySelection, setCategorySelection] = useState({ search: null, category: 'Todos' });
  const category = categorySelection.search === location.search
    ? categorySelection.category
    : (categories.includes(selectedFromUrl) ? selectedFromUrl : 'Todos');
  const [search, setSearch] = useState('');
  const products = useProducts();
  const visible = useMemo(() => products.filter(product =>
    (category === 'Todos' || product.category === category) &&
    `${product.name} ${product.origin} ${product.description}`.toLocaleLowerCase('es-CO').includes(search.trim().toLocaleLowerCase('es-CO'))
  ), [products, category, search]);

  return <IonPage><IonContent>
    <ShopHeader />
    <main className="page-shell">
      <div className="page-intro"><span className="eyebrow">NUESTRO CATÁLOGO</span><h1>De aquí, para ti.</h1><p>Frescura local en cada elección.</p></div>
      <label className="search-field"><span aria-hidden="true">⌕</span><input aria-label="Buscar productos" placeholder="¿Qué se te antoja hoy?" value={search} onChange={event => setSearch(event.target.value)} /></label>
      <div className="filter-row" role="group" aria-label="Filtrar por categoría">{categories.map(item => <button key={item} type="button" className={item === category ? 'active' : ''} onClick={() => setCategorySelection({ search: location.search, category: item })}>{item}</button>)}</div>
      <div className="section-heading"><h2>{category === 'Todos' ? 'Todos los productos' : category}</h2><small>{visible.length} productos</small></div>
      {visible.length ? <div className="product-grid">{visible.map(product => <CardItem key={product.id} product={product} />)}</div> : <div className="empty"><h2>No encontramos productos</h2><p>Prueba otra búsqueda o categoría.</p></div>}
    </main>
    <ChatShortcut />
  </IonContent></IonPage>;
}
