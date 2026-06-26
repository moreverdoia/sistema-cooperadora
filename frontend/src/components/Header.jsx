function Header() {
  return (
    <header className="encabezado">
      <div>
        <p className="eyebrow">Cooperadora escolar</p>
        <h1>Gestión financiera</h1>
        <p className="descripcion">
          Resumen general de ingresos, egresos y saldo disponible.
        </p>
      </div>

      <div className="estado-sistema">
        <span className="punto"></span>
        API conectada
      </div>
    </header>
  );
}

export default Header;