function MovimientoForm({
  formMovimiento,
  categoriasFiltradas,
  guardando,
  manejarCambioMovimiento,
  registrarMovimiento,
}) {
  return (
    <section className="form-panel">
      <div className="form-header">
        <div>
          <p className="eyebrow">Nuevo movimiento</p>
          <h2>Registrar ingreso o egreso</h2>
        </div>
      </div>

      <form onSubmit={registrarMovimiento} className="formulario">
        <label>
          Tipo
          <select name="tipo" value={formMovimiento.tipo} onChange={manejarCambioMovimiento}>
            <option value="INGRESO">Ingreso</option>
            <option value="EGRESO">Egreso</option>
          </select>
        </label>

        <label>
          Fecha
          <input type="date" name="fecha" value={formMovimiento.fecha} onChange={manejarCambioMovimiento} />
        </label>

        <label>
          Monto
          <input type="number" name="monto" min="0" step="0.01" placeholder="Ej: 15000" value={formMovimiento.monto} onChange={manejarCambioMovimiento} />
        </label>

        <label>
          Categoría
          <select name="categoriaId" value={formMovimiento.categoriaId} onChange={manejarCambioMovimiento}>
            <option value="">Seleccionar categoría</option>
            {categoriasFiltradas.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="campo-completo">
          Descripción opcional
          <input type="text" name="descripcion" placeholder="Ej: Pago de cuota mensual" value={formMovimiento.descripcion} onChange={manejarCambioMovimiento} />
        </label>

        <button type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Registrar movimiento'}
        </button>
      </form>
    </section>
  );
}

export default MovimientoForm;