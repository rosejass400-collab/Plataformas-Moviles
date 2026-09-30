import { useState } from "react";

import {
  IonButton,
  IonInput,
  IonItem,
} from "@ionic/react";

function ContactForm({
  onAddContact,
  disabled = false,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAddContact = async () => {
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanPhone || disabled) {
      return;
    }

    const newContact = {
      name: cleanName,
      phone: cleanPhone,
    };

    try {
      await onAddContact(newContact);

      setName("");
      setPhone("");
    } catch (error) {
      console.error(
        "Error al agregar contacto:",
        error
      );
    }
  };

  return (
    <div>
      <IonItem>
        <IonInput
          label="Nombre"
          labelPlacement="floating"
          placeholder="Ej: Pedro Rodríguez"
          value={name}
          disabled={disabled}
          onIonInput={(event) =>
            setName(event.detail.value || "")
          }
        />
      </IonItem>

      <IonItem>
        <IonInput
          type="tel"
          label="Teléfono"
          labelPlacement="floating"
          placeholder="Ej: 3011234567"
          value={phone}
          disabled={disabled}
          onIonInput={(event) =>
            setPhone(event.detail.value || "")
          }
        />
      </IonItem>

      <IonButton
        expand="block"
        disabled={disabled}
        onClick={handleAddContact}
      >
        Agregar contacto
      </IonButton>
    </div>
  );
}

export default ContactForm;