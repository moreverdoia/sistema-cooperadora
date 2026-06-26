const API_URL = 'http://localhost:3000/api';

const manejarRespuesta = async (respuesta, mensajeError) => {
  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.message || mensajeError);
  }

  return datos;
};

export const obtenerResumen = async () => {
  const respuesta = await fetch(`${API_URL}/movimientos/resumen`);
  return manejarRespuesta(respuesta, 'No se pudo obtener el resumen financiero');
};

export const obtenerCategorias = async () => {
  const respuesta = await fetch(`${API_URL}/categorias`);
  return manejarRespuesta(respuesta, 'No se pudieron obtener las categorías');
};

export const obtenerCuotas = async () => {
  const respuesta = await fetch(`${API_URL}/cuotas`);
  return manejarRespuesta(respuesta, 'No se pudieron obtener las cuotas');
};

export const obtenerCursos = async () => {
  const respuesta = await fetch(`${API_URL}/cursos`);
  return manejarRespuesta(respuesta, 'No se pudieron obtener los cursos');
};

export const crearMovimiento = async (movimiento) => {
  const respuesta = await fetch(`${API_URL}/movimientos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movimiento),
  });

  return manejarRespuesta(respuesta, 'No se pudo registrar el movimiento');
};

export const crearPagoCuota = async (pagoCuota) => {
  const respuesta = await fetch(`${API_URL}/pagos-cuotas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pagoCuota),
  });

  return manejarRespuesta(respuesta, 'No se pudo registrar el pago de cuota');
};

export const obtenerPerfilAlumnoPorDni = async (dni) => {
  const respuesta = await fetch(`${API_URL}/alumnos/dni/${dni}/cuotas`);
  return manejarRespuesta(respuesta, 'No se pudo buscar el alumno');
};

export const obtenerEstadoCurso = async (cursoId, cuotaId) => {
  const respuesta = await fetch(`${API_URL}/cursos/${cursoId}/cuotas?cuotaId=${cuotaId}`);
  return manejarRespuesta(respuesta, 'No se pudo consultar el estado del curso');
};