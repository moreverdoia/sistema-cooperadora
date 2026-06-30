import { useEffect, useState } from 'react';
import './App.css';

import Header from './components/Header';
import Mensaje from './components/Mensaje';
import ResumenFinanciero from './components/ResumenFinanciero';
import MovimientoForm from './components/MovimientoForm';
import PagoCuotaForm from './components/PagoCuotaForm';
import BuscarAlumno from './components/BuscarAlumno';
import EstadoCurso from './components/EstadoCurso';

import {
  buscarAlumnos,
  crearMovimiento,
  crearPagoCuota,
  obtenerCategorias,
  obtenerCursos,
  obtenerCuotas,
  obtenerEstadoCurso,
  obtenerPerfilAlumnoPorDni,
  obtenerResumen,
} from './services/api';

import { formatearMoneda } from './utils/formatters';

const fechaActual = new Date().toISOString().slice(0, 10);

function App() {
  const [resumen, setResumen] = useState({
    totalIngresos: 0,
    totalEgresos: 0,
    saldo: 0,
  });

  const [categorias, setCategorias] = useState([]);
  const [cuotas, setCuotas] = useState([]);
  const [cursos, setCursos] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [guardandoPagoCuota, setGuardandoPagoCuota] = useState(false);
  const [buscandoAlumno, setBuscandoAlumno] = useState(false);
  const [consultandoCurso, setConsultandoCurso] = useState(false);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const [busquedaAlumno, setBusquedaAlumno] = useState('');
  const [resultadosAlumnos, setResultadosAlumnos] = useState([]);
  const [perfilAlumno, setPerfilAlumno] = useState(null);  const [perfilAlumno, setPerfilAlumno] = useState(null);
  const [estadoCurso, setEstadoCurso] = useState(null);

  const [formMovimiento, setFormMovimiento] = useState({
    tipo: 'INGRESO',
    fecha: fechaActual,
    monto: '',
    descripcion: '',
    categoriaId: '',
  });

  const [formPagoCuota, setFormPagoCuota] = useState({
    dni: '',
    cuotaId: '',
    fecha: fechaActual,
    monto: '',
    observacion: '',
  });

  const [formEstadoCurso, setFormEstadoCurso] = useState({
    cursoId: '',
    cuotaId: '',
  });

  const categoriasFiltradas = categorias.filter(
    (categoria) => categoria.tipo === formMovimiento.tipo
  );

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [
          resumenDatos,
          categoriasDatos,
          cuotasDatos,
          cursosDatos,
        ] = await Promise.all([
          obtenerResumen(),
          obtenerCategorias(),
          obtenerCuotas(),
          obtenerCursos(),
        ]);

        setResumen(resumenDatos);
        setCategorias(categoriasDatos);
        setCuotas(cuotasDatos);
        setCursos(cursosDatos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  const manejarCambioMovimiento = (event) => {
    const { name, value } = event.target;

    setFormMovimiento((formActual) => {
      const nuevoForm = {
        ...formActual,
        [name]: value,
      };

      if (name === 'tipo') {
        nuevoForm.categoriaId = '';
      }

      return nuevoForm;
    });
  };

  const registrarMovimiento = async (event) => {
    event.preventDefault();

    setError('');
    setMensaje('');

    if (
      !formMovimiento.tipo ||
      !formMovimiento.fecha ||
      !formMovimiento.monto ||
      !formMovimiento.categoriaId
    ) {
      setError('Completá el tipo, la fecha, el monto y la categoría');
      return;
    }

    if (Number(formMovimiento.monto) <= 0) {
      setError('El monto debe ser mayor a cero');
      return;
    }

    try {
      setGuardando(true);

      await crearMovimiento({
        tipo: formMovimiento.tipo,
        fecha: formMovimiento.fecha,
        monto: Number(formMovimiento.monto),
        descripcion: formMovimiento.descripcion.trim(),
        categoriaId: Number(formMovimiento.categoriaId),
      });

      setMensaje(
        formMovimiento.tipo === 'INGRESO'
          ? 'Ingreso registrado correctamente'
          : 'Egreso registrado correctamente'
      );

      setFormMovimiento({
        tipo: formMovimiento.tipo,
        fecha: fechaActual,
        monto: '',
        descripcion: '',
        categoriaId: '',
      });

      const resumenActualizado = await obtenerResumen();
      setResumen(resumenActualizado);
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardando(false);
    }
  };

  const manejarCambioPagoCuota = (event) => {
    const { name, value } = event.target;

    setFormPagoCuota({
      ...formPagoCuota,
      [name]: value,
    });
  };

  const registrarPagoCuota = async (event) => {
    event.preventDefault();

    setError('');
    setMensaje('');

    if (
      !formPagoCuota.dni ||
      !formPagoCuota.cuotaId ||
      !formPagoCuota.fecha ||
      !formPagoCuota.monto
    ) {
      setError('Completá DNI, cuota, fecha y monto');
      return;
    }

    if (Number(formPagoCuota.monto) <= 0) {
      setError('El monto debe ser mayor a cero');
      return;
    }

    try {
      setGuardandoPagoCuota(true);

      await crearPagoCuota({
        dni: formPagoCuota.dni.trim(),
        cuotaId: Number(formPagoCuota.cuotaId),
        fecha: formPagoCuota.fecha,
        monto: Number(formPagoCuota.monto),
        observacion: formPagoCuota.observacion.trim(),
      });

      const dniPagado = formPagoCuota.dni.trim();

      setMensaje('Pago de cuota registrado correctamente');

      setFormPagoCuota({
        dni: '',
        cuotaId: '',
        fecha: fechaActual,
        monto: '',
        observacion: '',
      });

      const resumenActualizado = await obtenerResumen();
      setResumen(resumenActualizado);

      if (perfilAlumno?.alumno?.dni === dniPagado) {
        const perfilDatos = await obtenerPerfilAlumnoPorDni(dniPagado);
        setPerfilAlumno(perfilDatos);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setGuardandoPagoCuota(false);
    }
  };

  const buscarAlumnoPorNombre = async (event) => {
    event.preventDefault();

    setError('');
    setMensaje('');
    setPerfilAlumno(null);
    setResultadosAlumnos([]);

    if (!busquedaAlumno.trim()) {
      setError('Ingresá un nombre, apellido o DNI para buscar');
      return;
    }

    try {
      setBuscandoAlumno(true);

      const alumnos = await buscarAlumnos(busquedaAlumno.trim());
      setResultadosAlumnos(alumnos);

      if (alumnos.length === 0) {
        setMensaje('No se encontraron alumnos con esa búsqueda');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setBuscandoAlumno(false);
    }
  };

  const verPerfilAlumno = async (dni) => {
    setError('');
    setMensaje('');
    setPerfilAlumno(null);

    try {
      setBuscandoAlumno(true);

      const datos = await obtenerPerfilAlumnoPorDni(dni);
      setPerfilAlumno(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setBuscandoAlumno(false);
    }
  };

  const manejarCambioEstadoCurso = (event) => {
    const { name, value } = event.target;

    setFormEstadoCurso({
      ...formEstadoCurso,
      [name]: value,
    });
  };

  const consultarEstadoCurso = async (event) => {
    event.preventDefault();

    setError('');
    setMensaje('');
    setEstadoCurso(null);

    if (!formEstadoCurso.cursoId || !formEstadoCurso.cuotaId) {
      setError('Seleccioná un curso y una cuota');
      return;
    }

    try {
      setConsultandoCurso(true);

      const datos = await obtenerEstadoCurso(
        formEstadoCurso.cursoId,
        formEstadoCurso.cuotaId
      );

      setEstadoCurso(datos);
    } catch (error) {
      setError(error.message);
    } finally {
      setConsultandoCurso(false);
    }
  };

  return (
    <main className="app">
      <section className="dashboard">
        <Header />

        {cargando && (
          <Mensaje>
            <div className="spinner"></div>
            <p>Cargando información...</p>
          </Mensaje>
        )}

        {error && (
          <Mensaje tipo="error">
            <p>{error}</p>
          </Mensaje>
        )}

        {mensaje && (
          <Mensaje tipo="exito">
            <p>{mensaje}</p>
          </Mensaje>
        )}

        {!cargando && (
          <>
            <ResumenFinanciero
              resumen={resumen}
              formatearMoneda={formatearMoneda}
            />

            <MovimientoForm
              formMovimiento={formMovimiento}
              categoriasFiltradas={categoriasFiltradas}
              guardando={guardando}
              manejarCambioMovimiento={manejarCambioMovimiento}
              registrarMovimiento={registrarMovimiento}
            />

            <PagoCuotaForm
              cuotas={cuotas}
              formPagoCuota={formPagoCuota}
              guardandoPagoCuota={guardandoPagoCuota}
              manejarCambioPagoCuota={manejarCambioPagoCuota}
              registrarPagoCuota={registrarPagoCuota}
              formatearMoneda={formatearMoneda}
            />

            <BuscarAlumno
              dniBusqueda={dniBusqueda}
              setDniBusqueda={setDniBusqueda}
              perfilAlumno={perfilAlumno}
              buscandoAlumno={buscandoAlumno}
              buscarPerfilAlumno={buscarPerfilAlumno}
              formatearMoneda={formatearMoneda}
            />

            <EstadoCurso
              cursos={cursos}
              cuotas={cuotas}
              formEstadoCurso={formEstadoCurso}
              estadoCurso={estadoCurso}
              consultandoCurso={consultandoCurso}
              manejarCambioEstadoCurso={manejarCambioEstadoCurso}
              consultarEstadoCurso={consultarEstadoCurso}
              formatearMoneda={formatearMoneda}
            />
          </>
        )}
      </section>
    </main>
  );
}

export default App;