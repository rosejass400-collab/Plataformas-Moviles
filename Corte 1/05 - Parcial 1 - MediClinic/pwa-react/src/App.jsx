import { useEffect, useState } from "react";
import Login from "./components/Login";
import PatientForm from "./components/PatientForm";
import PatientList from "./components/PatientList";
import SearchBar from "./components/SearchBar";
import "./App.css";

function App() {
  // Estado de la sesión
  const [session, setSession] = useState(null);

  // Estado de los pacientes
  const [patients, setPatients] = useState([]);

  // Estado del buscador
  const [searchTerm, setSearchTerm] = useState("");

  // Recuperar sesión al cargar la aplicación
  useEffect(() => {
    const savedSession = localStorage.getItem("session");

    if (savedSession) {
      setSession(JSON.parse(savedSession));
    }
  }, []);

  // Cargar pacientes desde localStorage
  useEffect(() => {
    const savedPatients = localStorage.getItem("patients");

    if (savedPatients) {
      setPatients(JSON.parse(savedPatients));
    } else {
      // Pacientes iniciales
      const initialPatients = [
        {
          id: 1,
          name: "Juan",
          lastName: "Pérez",
          cc: "123456789",
          phone: "3001234567",
        },
        {
          id: 2,
          name: "María",
          lastName: "Gómez",
          cc: "987654321",
          phone: "3159876543",
        },
      ];

      setPatients(initialPatients);

      localStorage.setItem(
        "patients",
        JSON.stringify(initialPatients)
      );
    }
  }, []);

  // Agregar un nuevo paciente
  const handleAddPatient = (newPatient) => {
    setPatients((previousPatients) => {
      const updatedPatients = [
        ...previousPatients,
        newPatient,
      ];

      // Guardar pacientes actualizados en localStorage
      localStorage.setItem(
        "patients",
        JSON.stringify(updatedPatients)
      );

      return updatedPatients;
    });
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("session");
    setSession(null);
  };

  // Filtrar pacientes según la búsqueda
  const filteredPatients = patients.filter((patient) => {
    const search = searchTerm.toLowerCase();

    return (
      patient.name.toLowerCase().includes(search) ||
      patient.lastName.toLowerCase().includes(search) ||
      patient.cc.includes(search)
    );
  });

  // Si no hay sesión, mostrar el Login
  if (!session) {
    return <Login onLogin={setSession} />;
  }

  // Aplicación principal
  return (
    <div className="app-container">
      <header>
        <div>
          <h1>MediClinic</h1>
          <p>Bienvenido, {session.name}</p>
        </div>

        <button onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      <main>
        <h2>Administración de pacientes</h2>

        {/* Formulario para agregar pacientes */}
        <PatientForm onAddPatient={handleAddPatient} />

        {/* Buscador */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Lista filtrada enviada al componente hijo */}
        <PatientList patients={filteredPatients} />
      </main>
    </div>
  );
}

export default App;