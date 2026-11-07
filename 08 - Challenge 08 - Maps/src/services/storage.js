import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';

const TRACKS = 'recorridos';
const PHOTOS = 'fotos';

export async function saveTrack(track) {
  const path = `${TRACKS}/${track.date}/${track.id}.json`;
  await Filesystem.writeFile({
    path,
    data: JSON.stringify(track, null, 2),
    directory: Directory.Data,
    encoding: Encoding.UTF8,
    recursive: true,
  });
  return path;
}

export async function loadTracks() {
  try {
    const days = await Filesystem.readdir({ path: TRACKS, directory: Directory.Data });
    const all = await Promise.all(days.files.filter((file) => file.type === 'directory').map(async (day) => {
      const files = await Filesystem.readdir({ path: `${TRACKS}/${day.name}`, directory: Directory.Data });
      return Promise.all(files.files.filter((file) => file.name.endsWith('.json')).map(async (file) => {
        const result = await Filesystem.readFile({
          path: `${TRACKS}/${day.name}/${file.name}`,
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });
        try { return JSON.parse(result.data); } catch { return null; }
      }));
    }));
    return all.flat().filter(Boolean).sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  } catch (error) {
    const detail = String(error.message || error).toLowerCase();
    if (error.code === 'OS-PLUG-FILE-0008' || detail.includes('not exist') || detail.includes('not found')) return [];
    throw error;
  }
}

export async function savePhoto(dataUrl, id) {
  const path = `${PHOTOS}/${id}.jpg`;
  await Filesystem.writeFile({ path, data: dataUrl.split(',')[1], directory: Directory.Data, recursive: true });
  return path;
}

export async function loadPhoto(path) {
  const result = await Filesystem.readFile({ path, directory: Directory.Data });
  return `data:image/jpeg;base64,${result.data}`;
}
