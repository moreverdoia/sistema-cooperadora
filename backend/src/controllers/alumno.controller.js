const prisma = require('../config/prisma');

const obtenerAlumnos = async (req, res) => {
  try {
    const alumnos = await prisma.alumno.findMany({
      include: {
        curso: true,
      },
      orderBy: [
        {
          apellido: 'asc',
        },
        {
          nombre: 'asc',
        },
      ],
    });

    res.json(alumnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener los alumnos',
    });
  }
};

const obtenerAlumnoPorDni = async (req, res) => {
  try {
    const { dni } = req.params;

    const alumno = await prisma.alumno.findUnique({
      where: {
        dni,
      },
      include: {
        curso: true,
      },
    });

    if (!alumno) {
      return res.status(404).json({
        message: 'Alumno no encontrado',
      });
    }

    res.json(alumno);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al buscar el alumno',
    });
  }
};

const crearAlumno = async (req, res) => {
  try {
    const { dni, nombre, apellido, cursoId } = req.body;

    if (!dni || !nombre || !apellido || !cursoId) {
      return res.status(400).json({
        message: 'El DNI, nombre, apellido y curso son obligatorios',
      });
    }

    const alumnoExistente = await prisma.alumno.findUnique({
      where: {
        dni,
      },
    });

    if (alumnoExistente) {
      return res.status(409).json({
        message: 'Ya existe un alumno con ese DNI',
      });
    }

    const curso = await prisma.curso.findUnique({
      where: {
        id: Number(cursoId),
      },
    });

    if (!curso) {
      return res.status(404).json({
        message: 'El curso no existe',
      });
    }

    const nuevoAlumno = await prisma.alumno.create({
      data: {
        dni,
        nombre,
        apellido,
        cursoId: Number(cursoId),
      },
      include: {
        curso: true,
      },
    });

    res.status(201).json(nuevoAlumno);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al crear el alumno',
    });
  }
};

const obtenerPerfilCuotasPorDni = async (req, res) => {
  try {
    const { dni } = req.params;

    const alumno = await prisma.alumno.findUnique({
      where: {
        dni,
      },
      include: {
        curso: true,
        pagosCuota: {
          include: {
            cuota: true,
          },
          orderBy: {
            fecha: 'desc',
          },
        },
      },
    });

    if (!alumno) {
      return res.status(404).json({
        message: 'Alumno no encontrado',
      });
    }

    const totalPagado = alumno.pagosCuota.reduce((total, pago) => {
      return total + Number(pago.monto);
    }, 0);

    res.json({
      alumno: {
        id: alumno.id,
        dni: alumno.dni,
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        curso: alumno.curso,
      },
      resumen: {
        totalPagado,
        cantidadCuotasPagadas: alumno.pagosCuota.length,
      },
      pagos: alumno.pagosCuota,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener el perfil de cuotas del alumno',
    });
  }
};

const actualizarAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const { dni, nombre, apellido, cursoId } = req.body;

    if (!dni || !nombre || !apellido || !cursoId) {
      return res.status(400).json({
        message: 'El DNI, nombre, apellido y curso son obligatorios',
      });
    }

    const alumnoExistente = await prisma.alumno.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!alumnoExistente) {
      return res.status(404).json({
        message: 'Alumno no encontrado',
      });
    }

    const alumnoConDni = await prisma.alumno.findUnique({
      where: {
        dni,
      },
    });

    if (alumnoConDni && alumnoConDni.id !== Number(id)) {
      return res.status(409).json({
        message: 'Ya existe otro alumno con ese DNI',
      });
    }

    const curso = await prisma.curso.findUnique({
      where: {
        id: Number(cursoId),
      },
    });

    if (!curso) {
      return res.status(404).json({
        message: 'El curso no existe',
      });
    }

    const alumnoActualizado = await prisma.alumno.update({
      where: {
        id: Number(id),
      },
      data: {
        dni,
        nombre,
        apellido,
        cursoId: Number(cursoId),
      },
      include: {
        curso: true,
      },
    });

    res.json(alumnoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al actualizar el alumno',
    });
  }
};

const buscarAlumnos = async (req, res) => {
  try {
    const { termino } = req.query;

    if (!termino) {
      return res.status(400).json({
        message: 'Ingresá un nombre, apellido o DNI para buscar',
      });
    }

    const alumnos = await prisma.alumno.findMany({
      where: {
        OR: [
          {
            nombre: {
              contains: termino,
              mode: 'insensitive',
            },
          },
          {
            apellido: {
              contains: termino,
              mode: 'insensitive',
            },
          },
          {
            dni: {
              contains: termino,
            },
          },
        ],
      },
      include: {
        curso: true,
      },
      orderBy: [
        {
          apellido: 'asc',
        },
        {
          nombre: 'asc',
        },
      ],
    });

    res.json(alumnos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al buscar alumnos',
    });
  }
};

module.exports = {
  obtenerAlumnos,
  obtenerAlumnoPorDni,
  crearAlumno,
  obtenerPerfilCuotasPorDni,
  actualizarAlumno,
  buscarAlumnos,
};