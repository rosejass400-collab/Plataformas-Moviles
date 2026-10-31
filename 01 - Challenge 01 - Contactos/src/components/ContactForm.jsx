import React, { useState } from "react";

function ContactForm({ onAdd }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim()) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const newContact = {
      id: Date.now(),
      name: name.trim(),
      phone: phone.trim(),
    };

    onAdd(newContact);
    setName("");
    setPhone("");
  };

  return (
    <section className="form-container">
      <h2>Agregar contacto</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            placeholder="Ej: Pedro Rodríguez"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            id="phone"
            type="tel"
            placeholder="Ej: 3011234567"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <button className="add-button" type="submit">
          Agregar contacto
        </button>
      </form>
    </section>
  );
}

export default ContactForm;
