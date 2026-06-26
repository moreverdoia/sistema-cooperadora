const prisma = require('../config/prisma');

const obtenerCuotas = async (req, res) => {
  try {
    const cuotas = await prisma.cuota.findMany({
      orderBy: [
        {
          anio: 'desc',
        },
        {
          mes: 'desc',
        },
      ],
    });

    res.json(cuotas);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener las cuotas',
    });
  }
};

const crearCuota = async (req, res) => {
  try {
    const { nombre, mes, anio, montoEsperado } = req.body;

    if (!nombre || !mes || !anio || !montoEsperado) {
      return res.status(400).json({
        message: 'El nombre, mes, año y monto esperado son obligatorios',
      });
    }

    if (Number(mes) < 1 || Number(mes) > 12) {
      return res.status(400).json({
        message: 'El mes debe estar entre 1 y 12',
      });
    }

    if (Number(montoEsperado) <= 0) {
      return res.status(400).json({
        message: 'El monto esperado debe ser mayor a cero',
      });
    }

    const cuotaExistente = await prisma.cuota.findUnique({
      where: {
        mes_anio: {
          mes: Number(mes),
          anio: Number(anio),
        },
      },
    });

    if (cuotaExistente) {
      return res.status(409).json({
        message: 'Ya existe una cuota para ese mes y año',
      });
    }

    const nuevaCuota = await prisma.cuota.create({
      data: {
        nombre,
        mes: Number(mes),
        anio: Number(anio),
        montoEsperado,
      },
    });

    res.status(201).json(nuevaCuota);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al crear la cuota',
    });
  }
};

module.exports = {
  obtenerCuotas,
  crearCuota,
};