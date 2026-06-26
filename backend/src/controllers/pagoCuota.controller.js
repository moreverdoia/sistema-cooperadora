const prisma = require('../config/prisma');

const registrarPagoCuota = async (req, res) => {
  try {
    const { dni, cuotaId, fecha, monto, observacion } = req.body;

    if (!dni || !cuotaId || !fecha || !monto) {
      return res.status(400).json({
        message: 'El DNI, la cuota, la fecha y el monto son obligatorios',
      });
    }

    if (Number(monto) <= 0) {
      return res.status(400).json({
        message: 'El monto debe ser mayor a cero',
      });
    }

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
        message: 'No existe un alumno con ese DNI',
      });
    }

    const cuota = await prisma.cuota.findUnique({
      where: {
        id: Number(cuotaId),
      },
    });

    if (!cuota) {
      return res.status(404).json({
        message: 'La cuota no existe',
      });
    }

    const pagoExistente = await prisma.pagoCuota.findUnique({
      where: {
        alumnoId_cuotaId: {
          alumnoId: alumno.id,
          cuotaId: Number(cuotaId),
        },
      },
    });

    if (pagoExistente) {
      return res.status(409).json({
        message: 'Este alumno ya tiene registrada esa cuota',
      });
    }

    const categoriaCuotas = await prisma.categoria.findFirst({
  where: {
    nombre: 'Cuotas',
    tipo: 'INGRESO',
  },
});

if (!categoriaCuotas) {
  return res.status(404).json({
    message: 'No existe la categoría de ingreso "Cuotas"',
  });
}

const resultado = await prisma.$transaction(async (tx) => {
  const nuevoPago = await tx.pagoCuota.create({
    data: {
      alumnoId: alumno.id,
      cuotaId: Number(cuotaId),
      fecha: new Date(fecha),
      monto,
      observacion: observacion || null,
    },
    include: {
      alumno: {
        include: {
          curso: true,
        },
      },
      cuota: true,
    },
  });

  const nuevoMovimiento = await tx.movimiento.create({
    data: {
      tipo: 'INGRESO',
      fecha: new Date(fecha),
      monto,
      descripcion: `Pago de ${cuota.nombre} - ${alumno.apellido}, ${alumno.nombre} - DNI ${alumno.dni}`,
      categoriaId: categoriaCuotas.id,
    },
    include: {
      categoria: true,
    },
  });

  return {
    pago: nuevoPago,
    movimiento: nuevoMovimiento,
  };
});

res.status(201).json(resultado);

    res.status(201).json(nuevoPago);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al registrar el pago de cuota',
    });
  }
};

const obtenerPagosCuotas = async (req, res) => {
  try {
    const pagos = await prisma.pagoCuota.findMany({
      include: {
        alumno: {
          include: {
            curso: true,
          },
        },
        cuota: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    res.json(pagos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener los pagos de cuotas',
    });
  }
};

module.exports = {
  registrarPagoCuota,
  obtenerPagosCuotas,
};