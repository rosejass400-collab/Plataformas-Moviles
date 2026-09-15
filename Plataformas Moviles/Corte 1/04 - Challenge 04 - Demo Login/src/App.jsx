import { useEffect, useState } from "react";
import { IonApp } from "@ionic/react";
import LoginPage from "./pages/LoginPage";
import ListPage from "./pages/ListPage";

function App() {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const savedLogin = localStorage.getItem("logged");

    if (savedLogin === "true") {
      setLogged(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("logged", "true");
    setLogged(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("logged");
    setLogged(false);
  };

  return (
    <IonApp>
      {logged ? (
        <ListPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </IonApp>
  );
}

export default App;