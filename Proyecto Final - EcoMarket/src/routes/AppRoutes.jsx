import { IonRouterOutlet, IonTabs } from '@ionic/react';
import { Navigate, Route } from 'react-router-dom';
import Menu from '../components/Shared/Menu.jsx';
import Home from '../pages/Home/Index.jsx';
import Catalog from '../pages/Catalog/Index.jsx';
import Product from '../pages/Product/Index.jsx';
import Auth from '../pages/Auth/Index.jsx';
import Cart from '../pages/Cart/Index.jsx';
import Map from '../pages/Map/Index.jsx';
import Chat from '../pages/Chat/Index.jsx';
import Profile from '../pages/Profile/Index.jsx';
import Native from '../pages/Native/Index.jsx';
import Admin from '../pages/Admin/Index.jsx';
import Orders from '../pages/Orders/Index.jsx';
import Addresses from '../pages/Addresses/Index.jsx';
import UserRoutes from './UserRoutes.jsx';
import AdminRoutes from './AdminRoutes.jsx';

export default function AppRoutes() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/catalog" element={<Catalog />} />
        <Route exact path="/product/:id" element={<Product />} />
        <Route exact path="/auth" element={<Auth />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route exact path="/map" element={<Map />} />
        <Route exact path="/chat" element={<UserRoutes><Chat /></UserRoutes>} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/orders" element={<UserRoutes><Orders /></UserRoutes>} />
        <Route exact path="/addresses" element={<UserRoutes><Addresses /></UserRoutes>} />
        <Route exact path="/native" element={<Native />} />
        <Route exact path="/admin" element={<AdminRoutes><Admin /></AdminRoutes>} />
        <Route exact path="/" element={<Navigate to="/home" replace />} />
      </IonRouterOutlet>
      <Menu />
    </IonTabs>
  );
}
