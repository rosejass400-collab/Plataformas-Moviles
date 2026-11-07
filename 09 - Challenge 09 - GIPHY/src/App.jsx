import { useEffect, useRef, useState } from 'react';
import {
  IonApp, IonButton, IonContent, IonHeader, IonInput, IonItem,
  IonSpinner, IonTitle, IonToolbar,
} from '@ionic/react';
import { searchGifs } from './giphy';

export default function App() {
  const [term, setTerm] = useState('');
  const [searched, setSearched] = useState('');
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestRef = useRef(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  async function handleSearch(event) {
    event.preventDefault();
    const query = term.trim();
    if (!query) {
      setError('Escribe una palabra o frase para buscar.');
      return;
    }

    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setSearched(query);
    setGifs([]);
    setError('');
    setLoading(true);

    try {
      setGifs(await searchGifs(query, controller.signal));
    } catch (caught) {
      if (!controller.signal.aborted) {
        setError(caught instanceof TypeError ? 'No hay conexión con GIPHY. Revisa Internet e intenta otra vez.' : caught.message);
      }
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setLoading(false);
      }
    }
  }

  return (
    <IonApp>
      <IonHeader><IonToolbar className="app-toolbar"><IonTitle>GIFoteca <span>· Challenge 09</span></IonTitle></IonToolbar></IonHeader>
      <IonContent>
        <main className="page">
          <section className="intro">
            <p className="eyebrow">API REQUESTS / GIPHY</p>
            <h1>Busca un GIF<br />para cada momento<span>.</span></h1>
            <p>Escribe una palabra y mira los resultados al instante.</p>
          </section>

          <form className="search-panel" onSubmit={handleSearch}>
            <label htmlFor="gif-query">¿Qué quieres encontrar?</label>
            <div className="search-controls">
              <IonItem className="search-field" lines="none">
                <IonInput id="gif-query" aria-label="Buscar GIFs" value={term} maxlength={50} clearInput placeholder="Ej. gatos, fútbol, celebración" onIonInput={(event) => setTerm(event.detail.value || '')} />
              </IonItem>
              <IonButton type="submit" disabled={loading}>{loading ? 'Buscando…' : 'Buscar GIFs'}</IonButton>
            </div>
          </form>

          <section className="results" aria-live="polite">
            {loading && <div className="status"><IonSpinner name="crescent" /><span>Buscando «{searched}»…</span></div>}
            {!loading && error && <div className="status error" role="alert">{error}</div>}
            {!loading && !error && !searched && <div className="status empty">Tus resultados aparecerán aquí después de buscar.</div>}
            {!loading && !error && searched && <>
              <div className="results-heading"><div><p className="eyebrow">RESULTADOS</p><h2>«{searched}»</h2></div><span>{gifs.length} GIFs</span></div>
              {gifs.length ? <div className="gif-grid">{gifs.map((gif) => <article className="gif-card" key={gif.id}>
                <div className="gif-image"><img src={gif.image} alt={gif.title} width={gif.width} height={gif.height} loading="lazy" /></div>
                <p title={gif.title}>{gif.title}</p>
              </article>)}</div> : <div className="status empty">No encontramos GIFs. Prueba otra palabra.</div>}
            </>}
          </section>

          <footer className="attribution"><span className="giphy-mark" aria-hidden="true"><i /><i /><i /><i /></span> Powered by GIPHY</footer>
        </main>
      </IonContent>
    </IonApp>
  );
}
