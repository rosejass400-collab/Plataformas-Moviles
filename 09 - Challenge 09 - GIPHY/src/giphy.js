const API_URL = 'https://api.giphy.com/v1/gifs/search';

export async function searchGifs(query, signal) {
  const apiKey = import.meta.env.VITE_GIPHY_API_KEY?.trim();
  if (!apiKey) throw new Error('Falta configurar la clave de GIPHY en el archivo .env.');

  const params = new URLSearchParams({
    api_key: apiKey,
    q: query,
    limit: '25',
    offset: '0',
    rating: 'g',
    lang: 'es',
  });
  const response = await fetch(`${API_URL}?${params}`, { signal });
  if (!response.ok) {
    if (response.status === 429) throw new Error('Se alcanzó el límite de consultas. Intenta de nuevo más tarde.');
    if (response.status === 401 || response.status === 403) throw new Error('La clave de GIPHY no fue aceptada.');
    throw new Error(`No se pudo consultar GIPHY (${response.status}).`);
  }

  const result = await response.json();
  if (result.meta?.status && result.meta.status !== 200) {
    throw new Error(result.meta.msg || 'GIPHY no pudo completar la búsqueda.');
  }
  return (result.data || []).filter((gif) => gif.images?.fixed_width?.url).map((gif) => ({
    id: gif.id,
    title: gif.title || 'GIF sin título',
    image: gif.images.fixed_width.url,
    width: Number(gif.images.fixed_width.width) || 200,
    height: Number(gif.images.fixed_width.height) || 200,
  }));
}
