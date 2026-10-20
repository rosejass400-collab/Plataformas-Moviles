import { IonApp } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
export default function App(){return <IonApp><AuthProvider><CartProvider><IonReactRouter><AppRoutes/></IonReactRouter></CartProvider></AuthProvider></IonApp>}