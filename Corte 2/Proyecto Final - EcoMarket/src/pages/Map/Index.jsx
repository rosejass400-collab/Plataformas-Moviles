import { useEffect, useState } from 'react';
import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { stores } from '../../data/demoProducts.js';

export default function Map() {
 const [position,setPosition]=useState([4.6097,-74.0817]); const [message,setMessage]=useState('Mostrando puntos de entrega EcoMarket.');
 const locate=async()=>{ try { const permission=await Geolocation.requestPermissions(); if(permission.location==='denied'){setMessage('Permiso de ubicación denegado.');return;} const current=await Geolocation.getCurrentPosition({enableHighAccuracy:true}); setPosition([current.coords.latitude,current.coords.longitude]); setMessage('Ubicación actualizada desde el dispositivo.'); } catch { setMessage('No fue posible obtener la ubicación actual.'); } };
 useEffect(()=>{ locate(); },[]);
 return <IonPage><IonHeader><IonToolbar><IonTitle>Puntos EcoMarket</IonTitle></IonToolbar></IonHeader><IonContent className="ion-padding"><IonButton expand="block" fill="outline" onClick={locate}>Usar mi ubicación</IonButton><p className="map-message">{message}</p><div className="leaflet-wrap"><MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height:'100%',width:'100%'}}><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><Marker position={position}><Popup>Tu ubicación</Popup></Marker>{stores.map(store=><Marker key={store.id} position={[store.lat,store.lng]}><Popup><b>{store.name}</b><br/>{store.address}</Popup></Marker>)}</MapContainer></div><IonList>{stores.map(store=><IonItem key={store.id}><IonLabel><h2>{store.name}</h2><p>{store.address}</p></IonLabel></IonItem>)}</IonList></IonContent></IonPage>;
}