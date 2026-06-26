function PagoCuotaForm({
  cuotas,
  formPagoCuota,
  guardandoPagoCuota,
  manejarCambioPagoCuota,
  registrarPagoCuota,
  formatearMoneda,
}) {
  return (
    <section className="form-panel">
      <div className="form-header">
        <div>
          <p className="eyebrow">Cuotas</p>
          <h2>Registrar pago de cuota</h2>
        </div>
      </div>

      <form onSubmit={registrarPagoCuota} className="formulario">
        <label>
          DNI del alumno
          <input type="text" name="dni" placeholder="Ej: 45111222" value={formPagoCuota.dni} onChange={manejarCambioPagoCuota} />
        </label>

        <label>
          Cuota
          <select name="cuotaId" value={formPagoCuota.cuotaId} onChange={manejarCambioPagoCuota}>
            <option value="">Seleccionar cuota</option>
            {cuotas.map((cuota) => (
              <option key={cuota.id} value={cuota.id}>
                {cuota.nombre} - {formatearMoneda(Number(cuota.montoEsperado))}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fecha
          <input type="date" name="fecha" value={formPagoCuota.fecha} onChange={manejarCambioPagoCuota} />
        </label>

        <label>
          Monto
          <input type="number" name="monto" min="0" step="0.01" placeholder="Ej: 5000" value={formPagoCuota.monto} onChange={manejarCambioPagoCuota} />
        </label>

        <label className="campo-completo">
          Observación opcional
          <input type="text" name="observacion" placeholder="Ej: Pago completo" value={formPagoCuota.observacion} onChange={manejarCambioPagoCuota} />
        </label>

        <button type="submit" disabled={guardandoPagoCuota}>
          {guardandoPagoCuota ? 'Guardando...' : 'Registrar pago de cuota'}
        </button>
      </form>
    </section>
  );
}

export default PagoCuotaForm;