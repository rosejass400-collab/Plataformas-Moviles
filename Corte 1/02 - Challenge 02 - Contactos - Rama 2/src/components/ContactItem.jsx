import React from "react";

function ContactItem({ contact, onDelete }) {
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      `¿Deseas eliminar a ${contact.name}?`
    );

    if (confirmDelete) {
      onDelete(contact.id);
    }
  };

  return (
    <article className="contact-item">
      <div className="contact-info">
        <h3>{contact.name}</h3>
        <p>{contact.phone}</p>
      </div>

      <button className="delete-button" onClick={handleDelete}>
        Eliminar
      </button>
    </article>
  );
}

export default ContactItem;
