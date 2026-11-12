import tomatoes from '../assets/products/tomatoes.jpg';
import bread from '../assets/products/bread.jpg';
import avocados from '../assets/products/avocados.jpg';
import marketHero from '../assets/products/market-hero.jpg';

export { marketHero };

// Catálogo inicial del prototipo. Los pedidos y las conversaciones se guardan en Firestore.
export const demoProducts = [
  { id: 'tomate-chonto', name: 'Tomate chonto fresco', category: 'Frutas y verduras', price: 6500, unit: '1 kg', image: tomatoes, origin: 'Cundinamarca', rating: '4.9', description: 'Tomates maduros cosechados por productores locales. Ideales para ensaladas y preparaciones caseras.' },
  { id: 'pan-masa-madre', name: 'Pan de masa madre', category: 'Panadería', price: 14000, unit: 'Unidad', image: bread, origin: 'Bogotá', rating: '4.8', description: 'Pan artesanal de fermentación lenta, corteza crujiente y miga suave.' },
  { id: 'aguacate-hass', name: 'Aguacate Hass', category: 'Frutas y verduras', price: 9500, unit: '500 g', image: avocados, origin: 'Tolima', rating: '4.9', description: 'Aguacates cremosos de cultivo colombiano, seleccionados para llegar frescos a tu mesa.' },
  { id: 'canasta-local', name: 'Canasta de temporada', category: 'Canastas', price: 32000, unit: 'Canasta', image: marketHero, origin: 'Productores locales', rating: '4.9', description: 'Selección de alimentos frescos de temporada para compartir en casa.' },
];

export const categories = ['Todos', 'Frutas y verduras', 'Panadería', 'Canastas'];

// Puntos de referencia del prototipo, no comercios verificados.
export const stores = [
  { id: 'chapinero', name: 'EcoMarket Chapinero', address: 'Chapinero, Bogotá', lat: 4.6486, lng: -74.0615 },
  { id: 'centro', name: 'EcoMarket Centro', address: 'La Candelaria, Bogotá', lat: 4.6011, lng: -74.0721 },
];
