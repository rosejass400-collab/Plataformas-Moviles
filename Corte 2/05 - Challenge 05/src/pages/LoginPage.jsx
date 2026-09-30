import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonText,
} from "@ionic/react";

import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Error al iniciar sesion:", err);

      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Correo o contrasena incorrectos.");
      } else if (err.code === "auth/invalid-email") {
        setError("Ingresa un correo electronico valido.");
      } else {
        setError("No fue posible iniciar sesion. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="auth-page">
          <div className="auth-card">
            <h1>Iniciar sesion</h1>

            <p>Administrador de Tareas</p>

            <form onSubmit={handleSubmit}>
              <IonItem>
                <IonInput
                  type="email"
                  label="Correo"
                  labelPlacement="floating"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onIonInput={(event) =>
                    setEmail(event.detail.value || "")
                  }
                />
              </IonItem>

              <IonItem>
                <IonInput
                  type="password"
                  label="Contrasena"
                  labelPlacement="floating"
                  placeholder="Contrasena"
                  value={password}
                  onIonInput={(event) =>
                    setPassword(event.detail.value || "")
                  }
                />
              </IonItem>

              {error && (
                <IonText color="danger">
                  <p className="auth-error">{error}</p>
                </IonText>
              )}

              <IonButton
                type="submit"
                expand="block"
                disabled={loading}
              >
                {loading ? "Ingresando..." : "Iniciar sesion"}
              </IonButton>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default LoginPage;