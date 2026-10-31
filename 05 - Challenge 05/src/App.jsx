import {
  IonApp,
  IonContent,
  IonRouterOutlet,
  IonSpinner,
  IonText,
} from "@ionic/react";

import { IonReactRouter } from "@ionic/react-router";

import { Navigate, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TasksPage from "./pages/TasksPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import EditTaskPage from "./pages/EditTaskPage";

import { useAuth } from "./hooks/useAuth";

import "./App.css";

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <IonContent className="ion-padding">
        <div
          style={{
            textAlign: "center",
            marginTop: "100px",
          }}
        >
          <IonSpinner name="crescent" />

          <IonText>
            <p>Verificando sesión...</p>
          </IonText>
        </div>
      </IonContent>
    );
  }

  return (
    <IonRouterOutlet>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/tasks" replace />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/tasks" replace />
          ) : (
            <RegisterPage />
          )
        }
      />

      <Route
        path="/tasks"
        element={
          user ? (
            <TasksPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/tasks/:id"
        element={
          user ? (
            <TaskDetailPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/tasks/:id/edit"
        element={
          user ? (
            <EditTaskPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/"
        element={
          <Navigate
            to={user ? "/tasks" : "/login"}
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={user ? "/tasks" : "/login"}
            replace
          />
        }
      />
    </IonRouterOutlet>
  );
}

function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <AppRoutes />
      </IonReactRouter>
    </IonApp>
  );
}

export default App;