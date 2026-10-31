import { useState } from "react";
import {
  IonButton,
  IonInput,
  IonItem,
  IonText,
} from "@ionic/react";

import { useAuth } from "../hooks/useAuth";

function RegisterPage() {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password || !confirmPassword) {
      setError("Completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);

      await register(email.trim(), password);

      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setMessage("Usuario registrado correctamente.");
    } catch (err) {
      console.error("Error al registrar usuario:", err);

      if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado.");
      } else if (err.code === "auth/invalid-email") {
        setError("Ingresa un correo electrónico válido.");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña es demasiado débil.");
      } else {
        setError("No fue posible registrar el usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Crear cuenta</h1>

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

          <IonItem>
            <IonInput
              type="password"
              label="Confirmar contraseña"
              labelPlacement="floating"
              placeholder="Repite la contraseña"
              value={confirmPassword}
              onIonInput={(event) =>
                setConfirmPassword(event.detail.value || "")
              }
            />
          </IonItem>

          {error && (
            <IonText color="danger">
              <p className="auth-error">{error}</p>
            </IonText>
          )}

          {message && (
            <IonText color="success">
              <p className="auth-error">{message}</p>
            </IonText>
          )}

          <IonButton
            type="submit"
            expand="block"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Crear cuenta"}
          </IonButton>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;