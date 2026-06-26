import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

function ResumenFinanciero({ resumen, formatearMoneda }) {
  const datosBalance = [
    { nombre: 'Ingresos', monto: resumen.totalIngresos },
    { nombre: 'Egresos', monto: resumen.totalEgresos },
  ];

  const datosSaldo = [
    { nombre: 'Ingresos', valor: resumen.totalIngresos, color: '#34c759' },
    { nombre: 'Egresos', valor: resumen.totalEgresos, color: '#ff3b30' },
  ];

  const hayDatosFinancieros = resumen.totalIngresos > 0 || resumen.totalEgresos > 0;

  return (
    <>
      <section className="saldo-principal">
        <span>Saldo actual</span>
        <strong>{formatearMoneda(resumen.saldo)}</strong>
        <p>
          Resultado de restar los egresos registrados a los ingresos cargados.
        </p>
      </section>

      <section className="resumen-grid">
        <article className="card">
          <div className="card-header">
            <span className="icono ingreso"></span>
            <p>Ingresos</p>
          </div>
          <strong>{formatearMoneda(resumen.totalIngresos)}</strong>
        </article>

        <article className="card">
          <div className="card-header">
            <span className="icono egreso"></span>
            <p>Egresos</p>
          </div>
          <strong>{formatearMoneda(resumen.totalEgresos)}</strong>
        </article>

        <article className="card">
          <div className="card-header">
            <span className="icono saldo"></span>
            <p>Balance</p>
          </div>
          <strong>{resumen.saldo >= 0 ? 'Positivo' : 'Negativo'}</strong>
        </article>
      </section>

      <section className="graficos-grid">
        <article className="grafico-card">
          <div className="grafico-header">
            <div>
              <p className="eyebrow">Balance</p>
              <h2>Ingresos vs egresos</h2>
            </div>
          </div>

          {hayDatosFinancieros ? (
            <div className="grafico-contenedor">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosBalance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatearMoneda(Number(value))} />
                  <Bar dataKey="monto" radius={[10, 10, 0, 0]}>
                    <Cell fill="#34c759" />
                    <Cell fill="#ff3b30" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="grafico-vacio">Todavía no hay movimientos cargados.</p>
          )}
        </article>

        <article className="grafico-card">
          <div className="grafico-header">
            <div>
              <p className="eyebrow">Distribución</p>
              <h2>Composición financiera</h2>
            </div>
          </div>

          {hayDatosFinancieros ? (
            <div className="grafico-contenedor">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosSaldo}
                    dataKey="valor"
                    nameKey="nombre"
                    innerRadius={62}
                    outerRadius={92}
                    paddingAngle={4}
                  >
                    {datosSaldo.map((item) => (
                      <Cell key={item.nombre} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatearMoneda(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="grafico-vacio">
              Cargá un ingreso o egreso para ver el gráfico.
            </p>
          )}
        </article>
      </section>
    </>
  );
}

export default ResumenFinanciero;