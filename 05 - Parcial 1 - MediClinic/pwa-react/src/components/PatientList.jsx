function PatientList({ patients }) {
  return (
    <section className="patient-list-section">
      <h2>Lista de pacientes</h2>

      <p>Total de pacientes: {patients.length}</p>

      {patients.length === 0 ? (
        <p>No se encontraron pacientes.</p>
      ) : (
        <div className="patient-list">
          {patients.map((patient) => (
            <div className="patient-card" key={patient.id}>
              <h3>
                {patient.name} {patient.lastName}
              </h3>

              <p>
                <strong>CC:</strong> {patient.cc}
              </p>

              <p>
                <strong>Teléfono:</strong>{" "}
                {patient.phone || "No registrado"}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default PatientList;