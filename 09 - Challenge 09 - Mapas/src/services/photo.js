import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export async function takeWatermarkedPhoto(position) {
  localStorage.setItem('pendingPhotoPosition', JSON.stringify(position));
  const image = await Camera.getPhoto({
    quality: 80,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera,
    allowEditing: false,
  });
  localStorage.removeItem('pendingPhotoPosition');
  return watermarkPhotoResult(image, position);
}

export async function watermarkPhotoResult(image, position) {
  if (!image.base64String) throw new Error('La cámara no devolvió la foto.');
  const source = new Image();
  source.src = `data:image/${image.format || 'jpeg'};base64,${image.base64String}`;
  await source.decode();
  const canvas = document.createElement('canvas');
  const scale = Math.min(1, 1600 / Math.max(source.width, source.height));
  canvas.width = Math.round(source.width * scale);
  canvas.height = Math.round(source.height * scale);
  const context = canvas.getContext('2d');
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  const fontSize = Math.max(18, Math.round(canvas.width * 0.035));
  const barHeight = fontSize * 2.6;
  context.fillStyle = 'rgba(9, 28, 39, 0.78)';
  context.fillRect(0, canvas.height - barHeight, canvas.width, barHeight);
  context.fillStyle = '#ffffff';
  context.font = `600 ${fontSize}px sans-serif`;
  context.fillText(`${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`, fontSize, canvas.height - fontSize * 1.45);
  context.font = `${Math.round(fontSize * 0.75)}px sans-serif`;
  context.fillText(new Date().toLocaleString('es-CO'), fontSize, canvas.height - fontSize * 0.45);
  return canvas.toDataURL('image/jpeg', 0.85);
}
