function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <section className="search-section">
      <h2>Buscar paciente</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por nombre, apellido o CC"
      />
    </section>
  );
}

export default SearchBar;