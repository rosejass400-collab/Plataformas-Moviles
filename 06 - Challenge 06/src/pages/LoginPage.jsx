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

      console.log("Intentando iniciar sesión con:", email.trim());

      const user = await login(email.trim(), password);

      console.log("Inicio de sesión exitoso:", user);

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("ERROR COMPLETO DE FIREBASE:", err);
      console.error("Código:", err?.code);
      console.error("Mensaje:", err?.message);

      setError(
        `Error Firebase: ${err?.code || "desconocido"} - ${
          err?.message || "Sin mensaje"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="auth-page">
          <div className="auth-card">
            <h1>Iniciar sesión</h1>

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
                  label="Contraseña"
                  labelPlacement="floating"
                  placeholder="Contraseña"
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
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </IonButton>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}

export default LoginPage;