import React from "react";
import { useEffect, useState } from "react";
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import contactosImage from "./assets/contactos.png";
import "./App.css";

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const initialContacts = [
        { id: 1, name: "Juan Pérez", phone: "3001234567" },
        { id: 2, name: "María López", phone: "3159876543" },
        { id: 3, name: "Carlos Gómez", phone: "3105555555" },
      ];

      setContacts(initialContacts);
      setLoading(false);
    }, 2000);
  }, []);

  const addContact = (newContact) => {
    setContacts((currentContacts) => [
      ...currentContacts,
      newContact,
    ]);
  };

  const deleteContact = (id) => {
    setContacts((currentContacts) =>
      currentContacts.filter((contact) => contact.id !== id)
    );
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-spinner"></div>
        <h2>Cargando contactos...</h2>
        <p>Por favor espera un momento</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Mis Contactos</h1>
        <p>Administra tu lista de contactos</p>
      </header>

      <img
        src={contactosImage}
        alt="Mis contactos"
        className="contacts-image"
      />

      <main>
        <ContactForm onAdd={addContact} />
        <ContactList contacts={contacts} onDelete={deleteContact} />
      </main>
    </div>
  );
}

export default App;
