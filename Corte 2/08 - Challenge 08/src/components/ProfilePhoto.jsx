import { useEffect, useState } from 'react';
import { IonAvatar, IonButton, IonSpinner, IonIcon } from '@ionic/react';
import { cameraOutline } from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { supabase } from '../lib/supabase.js';

// Captura la imagen, la guarda en Storage y renueva su enlace privado.
export default function ProfilePhoto({ user, onChange }) {
  const [signedAvatar, setSignedAvatar] = useState({ path: '', url: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const path = user.user_metadata?.avatar_path;
  const version = user.user_metadata?.avatar_version;

  useEffect(() => {
    let current = true;
    if (!path || !supabase) return () => { current = false; };
    const refreshUrl = () => supabase.storage.from('avatars').createSignedUrl(path, 3600).then(({ data }) => {
      if (current) setSignedAvatar({ path, url: data?.signedUrl ? `${data.signedUrl}&v=${version || 0}` : '' });
    });
    refreshUrl();
    const timer = setInterval(refreshUrl, 50 * 60 * 1000);
    return () => { current = false; clearInterval(timer); };
  }, [path, version]);
  const url = signedAvatar.path === path ? signedAvatar.url : '';

  async function capturePhoto() {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const photo = await Camera.getPhoto({
        quality: 82,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Foto de perfil',
        promptLabelPhoto: 'Elegir imagen',
        promptLabelPicture: 'Tomar foto',
      });
      if (!photo.webPath || !supabase) return;
      setBusy(true);
      const image = await fetch(photo.webPath).then((response) => response.blob());
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(image.type)) throw new Error('Selecciona una imagen JPG, PNG, WebP o GIF.');
      if (image.size > 5 * 1024 * 1024) throw new Error('La imagen debe pesar menos de 5 MB.');
      const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }[image.type];
      const filePath = `${user.id}/avatar.${extension}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, image, {
        contentType: image.type,
        cacheControl: '0',
        upsert: true,
      });
      if (uploadError) throw uploadError;
      const { error: profileError } = await supabase.auth.updateUser({ data: { avatar_path: filePath, avatar_version: Date.now() } });
      if (profileError) throw profileError;
      await onChange();
    } catch (photoError) {
      if (photoError?.message !== 'User cancelled photos app') setError(photoError.message || 'No se pudo guardar la foto.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="profile-avatar-wrap">
      <IonAvatar className="profile-avatar">{url ? <img src={url} alt="Foto de perfil" /> : <span>{(user.user_metadata?.full_name || user.email || 'U').slice(0, 1).toUpperCase()}</span>}</IonAvatar>
      <IonButton size="small" fill="clear" className="avatar-action" onClick={capturePhoto} disabled={busy} aria-label="Tomar o elegir foto de perfil">
        {busy ? <IonSpinner name="dots" /> : <IonIcon slot="icon-only" icon={cameraOutline} />}
      </IonButton>
      {error && <span className="avatar-error">{error}</span>}
    </div>
  );
}
