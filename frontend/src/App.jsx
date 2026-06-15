import { useEffect, useState } from 'react';
import './App.css';

const formatearMoneda = (valor) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(valor);
};

const fechaActual = new Date().toISOString().slice(0, 10);

function App() {
  const [resumen, setResumen] = useState({
    totalIngresos: 0,
    totalEgresos: 0,
    saldo: 0,
  });

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [formIngreso, setFormIngreso] = useState({
    fecha: fechaActual,
    monto: '',
    descripcion: '',
    categoriaId: '',
  });

  const categoriasIngreso = categorias.filter((categoria) => categoria.tipo === 'INGRESO');

  const obtenerResumen = async () => {
    const respuesta = await fetch('http://localhost:3000/api/movimientos/resumen');

    if (!respuesta.ok) {
      throw new Error('No se pudo obtener el resumen financiero');
    }

    const datos = await respuesta.json();
    setResumen(datos);
  };

  const obtenerCategorias = async () => {
    const respuesta = await fetch('http://localhost:3000/api/categorias');

    if (!respuesta.ok) {
      throw new Error('No se pudieron obtener las categorías');
    }

    const datos = await respuesta.json();
    setCategorias(datos);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await Promise.all([obtenerResumen(), obtenerCategorias()]);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const manejarCambioIngreso = (event) => {
    const { name, value } = event.target;

    setFormIngreso({
      ...formIngreso,
      [name]: value,
    });
  };

  const registrarIngreso = async (event) => {
    event.preventDefault();

    setError('');
    setMensaje('');

    if (!formIngreso.fecha || !formIngreso.monto || !formIngreso.categoriaId) {
      setError('Completá la fecha, el monto y la categoría');
      return;
    }

    if (Number(formIngreso.monto) <= 0) {
      setError('El monto debe ser mayor a cero');
      return;
    }

    try {
      setGuardando(true);

      const respuesta = await fetch('http://localhost:3000/api/movimientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo: 'INGRESO',
          fecha: formIngreso.fecha,
          monto: Number(formIngreso.monto),
          descripcion: formIngreso.descripcion.trim(),
          categoriaId: Number(formIngreso.categoriaId),
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.message || 'No se pudo registrar el ingreso');
      }

      setMensaje('Ingreso registrado correctamente');

      setFormIngreso({
        fecha: fechaActual,
        monto: '',
        descripcion: '',
        categoriaId: '',
      });

      await obtenerResumen();
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="app">
      <section className="dashboard">
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

        {cargando && (
          <section className="mensaje">
            <div className="spinner"></div>
            <p>Cargando información...</p>
          </section>
        )}

        {error && (
          <section className="mensaje error">
            <p>{error}</p>
          </section>
        )}

        {mensaje && (
          <section className="mensaje exito">
            <p>{mensaje}</p>
          </section>
        )}

        {!cargando && (
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

            <section className="form-panel">
              <div className="form-header">
                <div>
                  <p className="eyebrow">Nuevo movimiento</p>
                  <h2>Registrar ingreso</h2>
                </div>
              </div>

              <form onSubmit={registrarIngreso} className="formulario">
                <label>
                  Fecha
                  <input
                    type="date"
                    name="fecha"
                    value={formIngreso.fecha}
                    onChange={manejarCambioIngreso}
                  />
                </label>

                <label>
                  Monto
                  <input
                    type="number"
                    name="monto"
                    min="0"
                    step="0.01"
                    placeholder="Ej: 15000"
                    value={formIngreso.monto}
                    onChange={manejarCambioIngreso}
                  />
                </label>

                <label>
                  Categoría
                  <select
                    name="categoriaId"
                    value={formIngreso.categoriaId}
                    onChange={manejarCambioIngreso}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categoriasIngreso.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="campo-completo">
                  Descripción
                  <input
                    type="text"
                    name="descripcion"
                    placeholder="Ej: Pago de cuota mensual"
                    value={formIngreso.descripcion}
                    onChange={manejarCambioIngreso}
                  />
                </label>

                <button type="submit" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Registrar ingreso'}
                </button>
              </form>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

export default App;