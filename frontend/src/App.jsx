import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [resumen, setResumen] = useState({
    totalIngresos: 0,
    totalEgresos: 0,
    saldo: 0,
  });

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const obtenerResumen = async () => {
      try {
        const respuesta = await fetch('http://localhost:3000/api/movimientos/resumen');

        if (!respuesta.ok) {
          throw new Error('No se pudo obtener el resumen');
        }

        const datos = await respuesta.json();
        setResumen(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerResumen();
  }, []);

  return (
    <main className="app">
      <section className="panel">
        <h1>Sistema de Gestión de Cooperadora</h1>
        <p className="subtitulo">Resumen financiero general</p>

        {cargando && <p>Cargando resumen...</p>}

        {error && <p className="error">{error}</p>}

        {!cargando && !error && (
          <div className="resumen-grid">
            <article className="resumen-card ingreso">
              <span>Total ingresos</span>
              <strong>${resumen.totalIngresos}</strong>
            </article>

            <article className="resumen-card egreso">
              <span>Total egresos</span>
              <strong>${resumen.totalEgresos}</strong>
            </article>

            <article className="resumen-card saldo">
              <span>Saldo actual</span>
              <strong>${resumen.saldo}</strong>
            </article>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;