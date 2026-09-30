import {
  IonList,
  IonText,
} from "@ionic/react";

import ContactItem from "./ContactItem";

function ContactList({
  contacts,
  onDeleteContact,
  disabled = false,
}) {
  if (contacts.length === 0) {
    return (
      <IonText>
        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <p>No hay contactos registrados.</p>
          <p>
            Agrega tu primer contacto usando el formulario.
          </p>
        </div>
      </IonText>
    );
  }

  return (
    <>
      <div
        style={{
          marginTop: "25px",
          marginBottom: "10px",
        }}
      >
        <h2
          style={{
            color: "#222222",
          }}
        >
          Lista de contactos
        </h2>

        <p>
          {contacts.length} contacto
          {contacts.length !== 1 ? "s" : ""}
        </p>
      </div>

      <IonList>
        {contacts.map((contact) => (
          <ContactItem
            key={contact.id}
            contact={contact}
            onDeleteContact={onDeleteContact}
            disabled={disabled}
          />
        ))}
      </IonList>
    </>
  );
}

export default ContactList;