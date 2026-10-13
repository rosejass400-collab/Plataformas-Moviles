
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route } from 'react-router-dom';

import HomePage from './pages/HomePage.jsx';
import GeolocationPage from './pages/GeolocationPage.jsx';
import CameraPage from './pages/CameraPage.jsx';
import MotionPage from './pages/MotionPage.jsx';
import DevicePage from './pages/DevicePage.jsx';
import HapticsPage from './pages/HapticsPage.jsx';
import LocalNotificationsPage from './pages/LocalNotificationsPage.jsx';
import PushNotificationsPage from './pages/PushNotificationsPage.jsx';

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            exact
            path="/home"
            element={<HomePage />}
          />

          <Route
            exact
            path="/geolocation"
            element={<GeolocationPage />}
          />

          <Route
            exact
            path="/camera"
            element={<CameraPage />}
          />

          <Route
            exact
            path="/motion"
            element={<MotionPage />}
          />

          <Route
            exact
            path="/device"
            element={<DevicePage />}
          />

          <Route
            exact
            path="/haptics"
            element={<HapticsPage />}
          />

          <Route
            exact
            path="/local-notifications"
            element={<LocalNotificationsPage />}
          />

          <Route
            exact
            path="/push-notifications"
            element={<PushNotificationsPage />}
          />

          <Route
            exact
            path="/"
            element={<Navigate to="/home" replace />}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
