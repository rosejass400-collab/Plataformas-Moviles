  import React from "react";
  import ContactItem from "./ContactItem";

  function ContactList({ contacts, onDelete }) {
    return (
      <section className="list-container">
        <div className="list-header">
          <h2>Lista de contactos</h2>
          <span className="contact-count">
            {contacts.length} contacto{contacts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {contacts.length === 0 ? (
          <div className="empty-message">
            <p>No hay contactos registrados.</p>
            <p>Agrega tu primer contacto usando el formulario.</p>
          </div>
        ) : (
          <div className="contacts">
            {contacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  export default ContactList;
