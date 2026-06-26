const prisma = require('../config/prisma');

const obtenerCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });

    res.json(cursos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener los cursos',
    });
  }
};

const crearCurso = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre del curso es obligatorio',
      });
    }

    const cursoExistente = await prisma.curso.findUnique({
      where: {
        nombre,
      },
    });

    if (cursoExistente) {
      return res.status(409).json({
        message: 'Ya existe un curso con ese nombre',
      });
    }

    const nuevoCurso = await prisma.curso.create({
      data: {
        nombre,
      },
    });

    res.status(201).json(nuevoCurso);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al crear el curso',
    });
  }
};

const obtenerEstadoCuotasPorCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { cuotaId } = req.query;

    if (!cuotaId) {
      return res.status(400).json({
        message: 'El parámetro cuotaId es obligatorio',
      });
    }

    const curso = await prisma.curso.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        alumnos: {
          orderBy: [
            {
              apellido: 'asc',
            },
            {
              nombre: 'asc',
            },
          ],
        },
      },
    });

    if (!curso) {
      return res.status(404).json({
        message: 'Curso no encontrado',
      });
    }

    const cuota = await prisma.cuota.findUnique({
      where: {
        id: Number(cuotaId),
      },
    });

    if (!cuota) {
      return res.status(404).json({
        message: 'Cuota no encontrada',
      });
    }

    const pagos = await prisma.pagoCuota.findMany({
      where: {
        cuotaId: Number(cuotaId),
        alumno: {
          cursoId: Number(id),
        },
      },
      include: {
        alumno: true,
      },
    });

    const pagosPorAlumno = new Map();

    pagos.forEach((pago) => {
      pagosPorAlumno.set(pago.alumnoId, pago);
    });

    const alumnos = curso.alumnos.map((alumno) => {
      const pago = pagosPorAlumno.get(alumno.id);

      return {
        id: alumno.id,
        dni: alumno.dni,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        estado: pago ? 'PAGADO' : 'ADEUDA',
        montoPagado: pago ? Number(pago.monto) : 0,
        fechaPago: pago ? pago.fecha : null,
      };
    });

    const totalAlumnos = alumnos.length;
    const cantidadPagaron = alumnos.filter((alumno) => alumno.estado === 'PAGADO').length;
    const cantidadAdeudan = totalAlumnos - cantidadPagaron;
    const totalRecaudado = alumnos.reduce((total, alumno) => {
      return total + alumno.montoPagado;
    }, 0);

    const porcentajePago = totalAlumnos > 0
      ? Math.round((cantidadPagaron / totalAlumnos) * 100)
      : 0;

    res.json({
      curso: {
        id: curso.id,
        nombre: curso.nombre,
      },
      cuota,
      resumen: {
        totalAlumnos,
        cantidadPagaron,
        cantidadAdeudan,
        porcentajePago,
        totalRecaudado,
      },
      alumnos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener el estado de cuotas del curso',
    });
  }
};

module.exports = {
  obtenerCursos,
  crearCurso,
  obtenerEstadoCuotasPorCurso,
};