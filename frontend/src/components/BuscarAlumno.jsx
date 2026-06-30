function BuscarAlumno({
  busquedaAlumno,
  setBusquedaAlumno,
  resultadosAlumnos,
  seleccionarAlumno,
  perfilAlumno,
  buscandoAlumno,
  buscarPerfilAlumno,
  formatearMoneda,
}) {
  return (
    <section className="form-panel">
      <div className="form-header">
        <div>
          <p className="eyebrow">Cuotas</p>
          <h2>Buscar estudiante</h2>
        </div>
      </div>

      <form onSubmit={buscarPerfilAlumno} className="busqueda-dni">
        <input
          type="text"
          placeholder="Ingresá nombre o apellido"
          value={busquedaAlumno}
          onChange={(e) => setBusquedaAlumno(e.target.value)}
        />

        <button type="submit" disabled={buscandoAlumno}>
          {buscandoAlumno ? 'Buscando...' : 'Buscar alumno'}
        </button>
      </form>

      {resultadosAlumnos.length > 0 && (
        <div className="resultados-alumnos">
          {resultadosAlumnos.map((alumno) => (
            <div
              key={alumno.id}
              className="resultado-item"
              onClick={() => seleccionarAlumno(alumno)}
              style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}
            >
              {alumno.apellido}, {alumno.nombre} — DNI {alumno.dni}
            </div>
          ))}
        </div>
      )}

      {perfilAlumno && (
        <div className="perfil-alumno">
          <div className="perfil-header">
            <div>
              <p className="eyebrow">Alumno</p>
              <h3>
                {perfilAlumno.alumno.apellido}, {perfilAlumno.alumno.nombre}
              </h3>
              <p>
                DNI {perfilAlumno.alumno.dni} · Curso{' '}
                {perfilAlumno.alumno.curso.nombre}
              </p>
            </div>

            <div className="perfil-total">
              <span>Total pagado</span>
              <strong>{formatearMoneda(perfilAlumno.resumen.totalPagado)}</strong>
            </div>
          </div>

          <div className="mini-resumen">
            <article>
              <span>Cuotas pagadas</span>
              <strong>{perfilAlumno.resumen.cantidadCuotasPagadas}</strong>
            </article>

            <article>
              <span>Total pagado</span>
              <strong>{formatearMoneda(perfilAlumno.resumen.totalPagado)}</strong>
            </article>
          </div>

          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Cuota</th>
                  <th>Fecha</th>
                  <th>Monto</th>
                  <th>Observación</th>
                </tr>
              </thead>
              <tbody>
                {perfilAlumno.pagos.length === 0 && (
                  <tr>
                    <td colSpan="4">
                      Este alumno todavía no tiene pagos registrados.
                    </td>
                  </tr>
                )}

                {perfilAlumno.pagos.map((pago) => (
                  <tr key={pago.id}>
                    <td>{pago.cuota.nombre}</td>
                    <td>{new Date(pago.fecha).toLocaleDateString('es-AR')}</td>
                    <td>{formatearMoneda(Number(pago.monto))}</td>
                    <td>{pago.observacion || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

export default BuscarAlumno;