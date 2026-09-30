import {
  IonButton,
  IonItem,
  IonLabel,
} from "@ionic/react";

function ContactItem({
  contact,
  onDeleteContact,
  disabled = false,
}) {
  const handleDelete = async () => {
    if (disabled) {
      return;
    }

    const confirmDelete = window.confirm(
      `¿Deseas eliminar a ${contact.name}?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await onDeleteContact(contact.id);
    } catch (error) {
      console.error(
        "Error al eliminar contacto:",
        error
      );
    }
  };

  return (
    <IonItem>
      <IonLabel>
        <h2
          style={{
            color: "#222222",
          }}
        >
          {contact.name}
        </h2>

        <p>{contact.phone}</p>
      </IonLabel>

      <IonButton
        slot="end"
        color="danger"
        disabled={disabled}
        onClick={handleDelete}
      >
        Eliminar
      </IonButton>
    </IonItem>
  );
}

export default ContactItem;