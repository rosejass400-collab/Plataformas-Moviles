import { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Usuarios fijos
    const users = [
      {
        username: "medico",
        password: "123456",
        name: "Dr. Carlos Medina",
      },
      {
        username: "admin",
        password: "admin123",
        name: "Administrador",
      },
    ];

    const user = users.find(
      (user) =>
        user.username === username &&
        user.password === password
    );

    if (user) {
      localStorage.setItem("session", JSON.stringify(user));
      onLogin(user);
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>MediClinic</h1>
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuario</label>

            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Ingrese su usuario"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Ingrese su contraseña"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit">Ingresar</button>
        </form>

        <div className="login-info">
          <p>
            Usuario: <strong>medico</strong>
          </p>

          <p>
            Contraseña: <strong>123456</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;