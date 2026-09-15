import { useState } from "react";

function PatientForm({ onAddPatient }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cc, setCc] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validar campos obligatorios
    if (!name.trim() || !lastName.trim() || !cc.trim()) {
      setError("Nombre, apellido y CC son obligatorios.");
      return;
    }

    const newPatient = {
      id: Date.now(),
      name: name.trim(),
      lastName: lastName.trim(),
      cc: cc.trim(),
      phone: phone.trim(),
    };

    onAddPatient(newPatient);

    // Limpiar formulario
    setName("");
    setLastName("");
    setCc("");
    setPhone("");
    setError("");
  };

  return (
    <section className="patient-form-section">
      <h2>Agregar paciente</h2>

      <form className="patient-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre *</label>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ingrese el nombre"
          />
        </div>

        <div className="form-group">
          <label>Apellido *</label>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Ingrese el apellido"
          />
        </div>

        <div className="form-group">
          <label>CC *</label>
          <input
            type="text"
            value={cc}
            onChange={(event) => setCc(event.target.value)}
            placeholder="Ingrese el número de documento"
          />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Ingrese el teléfono"
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit">Agregar paciente</button>
      </form>
    </section>
  );
}

export default PatientForm;