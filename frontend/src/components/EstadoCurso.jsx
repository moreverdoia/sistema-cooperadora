function EstadoCurso({
  cursos,
  cuotas,
  formEstadoCurso,
  estadoCurso,
  consultandoCurso,
  manejarCambioEstadoCurso,
  consultarEstadoCurso,
  formatearMoneda,
}) {
  return (
    <section className="form-panel">
      <div className="form-header">
        <div>
          <p className="eyebrow">Seguimiento por curso</p>
          <h2>Estado de cuotas por curso</h2>
        </div>
      </div>

      <form onSubmit={consultarEstadoCurso} className="formulario compacto">
        <label>
          Curso
          <select
            name="cursoId"
            value={formEstadoCurso.cursoId}
            onChange={manejarCambioEstadoCurso}
          >
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>
                {curso.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cuota
          <select
            name="cuotaId"
            value={formEstadoCurso.cuotaId}
            onChange={manejarCambioEstadoCurso}
          >
            <option value="">Seleccionar cuota</option>
            {cuotas.map((cuota) => (
              <option key={cuota.id} value={cuota.id}>
                {cuota.nombre}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={consultandoCurso}>
          {consultandoCurso ? 'Consultando...' : 'Consultar estado'}
        </button>
      </form>

      {estadoCurso && (
        <div className="estado-curso">
          <div className="perfil-header">
            <div>
              <p className="eyebrow">Curso</p>
              <h3>
                {estadoCurso.curso.nombre} · {estadoCurso.cuota.nombre}
              </h3>
              <p>
                Monto esperado por alumno:{' '}
                {formatearMoneda(Number(estadoCurso.cuota.montoEsperado))}
              </p>
            </div>

            <div className="perfil-total">
              <span>Avance</span>
              <strong>{estadoCurso.resumen.porcentajePago}%</strong>
            </div>
          </div>

          <div className="mini-resumen cuatro-columnas">
            <article>
              <span>Alumnos</span>
              <strong>{estadoCurso.resumen.totalAlumnos}</strong>
            </article>

            <article>
              <span>Pagaron</span>
              <strong>{estadoCurso.resumen.cantidadPagaron}</strong>
            </article>

            <article>
              <span>Adeudan</span>
              <strong>{estadoCurso.resumen.cantidadAdeudan}</strong>
            </article>

            <article>
              <span>Recaudado</span>
              <strong>{formatearMoneda(estadoCurso.resumen.totalRecaudado)}</strong>
            </article>
          </div>

          <div className="barra-progreso">
            <div style={{ width: `${estadoCurso.resumen.porcentajePago}%` }}></div>
          </div>

          <div className="tabla-contenedor">
            <table>
              <thead>
                <tr>
                  <th>Alumno</th>
                  <th>DNI</th>
                  <th>Estado</th>
                  <th>Monto pagado</th>
                  <th>Fecha pago</th>
                </tr>
              </thead>
              <tbody>
                {estadoCurso.alumnos.map((alumno) => (
                  <tr key={alumno.id}>
                    <td>
                      {alumno.apellido}, {alumno.nombre}
                    </td>
                    <td>{alumno.dni}</td>
                    <td>
                      <span
                        className={
                          alumno.estado === 'PAGADO'
                            ? 'badge pagado'
                            : 'badge adeuda'
                        }
                      >
                        {alumno.estado}
                      </span>
                    </td>
                    <td>{formatearMoneda(alumno.montoPagado)}</td>
                    <td>
                      {alumno.fechaPago
                        ? new Date(alumno.fechaPago).toLocaleDateString('es-AR')
                        : '-'}
                    </td>
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

export default EstadoCurso;