import { Navigate, Route } from 'react-router-dom';

import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';

import { IonReactRouter } from '@ionic/react-router';

import {
  calendar,
  people,
  person
} from 'ionicons/icons';

import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import VisitDetail from './pages/VisitDetail';
import Login from './pages/Login';

/* Core CSS required for Ionic */
import '@ionic/react/css/core.css';

/* Basic CSS */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const sesion = localStorage.getItem('sesion');

  return (
    <IonApp>
      <IonReactRouter>

        <IonRouterOutlet>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/"
            element={
              sesion
                ? <Navigate to="/visitas" replace />
                : <Navigate to="/login" replace />
            }
          />

        </IonRouterOutlet>

        {sesion && (
          <IonTabs>

            <IonRouterOutlet>

              <Route
                path="/visitas"
                element={<Tab1 />}
              />

              <Route
                path="/visitas/:id"
                element={<VisitDetail />}
              />

              <Route
                path="/pacientes"
                element={<Tab2 />}
              />

              <Route
                path="/perfil"
                element={<Tab3 />}
              />

            </IonRouterOutlet>

            <IonTabBar slot="bottom">

              <IonTabButton
                tab="visitas"
                href="/visitas"
              >
                <IonIcon
                  aria-hidden="true"
                  icon={calendar}
                />

                <IonLabel>
                  Visitas
                </IonLabel>
              </IonTabButton>

              <IonTabButton
                tab="pacientes"
                href="/pacientes"
              >
                <IonIcon
                  aria-hidden="true"
                  icon={people}
                />

                <IonLabel>
                  Pacientes
                </IonLabel>
              </IonTabButton>

              <IonTabButton
                tab="perfil"
                href="/perfil"
              >
                <IonIcon
                  aria-hidden="true"
                  icon={person}
                />

                <IonLabel>
                  Perfil
                </IonLabel>
              </IonTabButton>

            </IonTabBar>

          </IonTabs>
        )}

      </IonReactRouter>
    </IonApp>
  );
};

export default App;