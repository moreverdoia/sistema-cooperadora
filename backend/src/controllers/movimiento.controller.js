const prisma = require('../config/prisma');

const obtenerMovimientos = async (req, res) => {
  try {
    const movimientos = await prisma.movimiento.findMany({
      include: {
        categoria: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    res.json(movimientos);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener los movimientos',
    });
  }
};

const obtenerMovimientoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const movimiento = await prisma.movimiento.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        categoria: true,
      },
    });

    if (!movimiento) {
      return res.status(404).json({
        message: 'Movimiento no encontrado',
      });
    }

    res.json(movimiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener el movimiento',
    });
  }
};

const crearMovimiento = async (req, res) => {
  try {
    const { tipo, fecha, monto, descripcion, categoriaId } = req.body;

    if (!tipo || !fecha || !monto || !descripcion || !categoriaId) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios',
      });
    }

    if (tipo !== 'INGRESO' && tipo !== 'EGRESO') {
      return res.status(400).json({
        message: 'El tipo debe ser INGRESO o EGRESO',
      });
    }

    if (Number(monto) <= 0) {
      return res.status(400).json({
        message: 'El monto debe ser mayor a cero',
      });
    }

    const categoria = await prisma.categoria.findUnique({
      where: {
        id: Number(categoriaId),
      },
    });

    if (!categoria) {
      return res.status(404).json({
        message: 'La categoría no existe',
      });
    }

    if (categoria.tipo !== tipo) {
      return res.status(400).json({
        message: 'La categoría no corresponde al tipo de movimiento',
      });
    }

    const nuevoMovimiento = await prisma.movimiento.create({
      data: {
        tipo,
        fecha: new Date(fecha),
        monto,
        descripcion,
        categoriaId: Number(categoriaId),
      },
      include: {
        categoria: true,
      },
    });

    res.status(201).json(nuevoMovimiento);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al crear el movimiento',
    });
  }
};

const actualizarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, fecha, monto, descripcion, categoriaId } = req.body;

    const movimientoExistente = await prisma.movimiento.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!movimientoExistente) {
      return res.status(404).json({
        message: 'Movimiento no encontrado',
      });
    }

    if (!tipo || !fecha || !monto || !descripcion || !categoriaId) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios',
      });
    }

    if (tipo !== 'INGRESO' && tipo !== 'EGRESO') {
      return res.status(400).json({
        message: 'El tipo debe ser INGRESO o EGRESO',
      });
    }

    if (Number(monto) <= 0) {
      return res.status(400).json({
        message: 'El monto debe ser mayor a cero',
      });
    }

    const categoria = await prisma.categoria.findUnique({
      where: {
        id: Number(categoriaId),
      },
    });

    if (!categoria) {
      return res.status(404).json({
        message: 'La categoría no existe',
      });
    }

    if (categoria.tipo !== tipo) {
      return res.status(400).json({
        message: 'La categoría no corresponde al tipo de movimiento',
      });
    }

    const movimientoActualizado = await prisma.movimiento.update({
      where: {
        id: Number(id),
      },
      data: {
        tipo,
        fecha: new Date(fecha),
        monto,
        descripcion,
        categoriaId: Number(categoriaId),
      },
      include: {
        categoria: true,
      },
    });

    res.json(movimientoActualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al actualizar el movimiento',
    });
  }
};

const eliminarMovimiento = async (req, res) => {
  try {
    const { id } = req.params;

    const movimientoExistente = await prisma.movimiento.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!movimientoExistente) {
      return res.status(404).json({
        message: 'Movimiento no encontrado',
      });
    }

    await prisma.movimiento.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: 'Movimiento eliminado correctamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al eliminar el movimiento',
    });
  }
};

const obtenerResumenMovimientos = async (req, res) => {
  try {
    const ingresos = await prisma.movimiento.aggregate({
      where: {
        tipo: 'INGRESO',
      },
      _sum: {
        monto: true,
      },
    });

    const egresos = await prisma.movimiento.aggregate({
      where: {
        tipo: 'EGRESO',
      },
      _sum: {
        monto: true,
      },
    });

    const totalIngresos = Number(ingresos._sum.monto || 0);
    const totalEgresos = Number(egresos._sum.monto || 0);
    const saldo = totalIngresos - totalEgresos;

    res.json({
      totalIngresos,
      totalEgresos,
      saldo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener el resumen de movimientos',
    });
  }
};

module.exports = {
  obtenerMovimientos,
  obtenerMovimientoPorId,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
  obtenerResumenMovimientos,
};