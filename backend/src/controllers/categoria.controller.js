const prisma = require('../config/prisma');

const obtenerCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: {
        nombre: 'asc',
      },
    });

    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al obtener las categorías',
    });
  }
};

const crearCategoria = async (req, res) => {
  try {
    const { nombre, tipo } = req.body;

    if (!nombre || !tipo) {
      return res.status(400).json({
        message: 'El nombre y el tipo son obligatorios',
      });
    }

    if (tipo !== 'INGRESO' && tipo !== 'EGRESO') {
      return res.status(400).json({
        message: 'El tipo debe ser INGRESO o EGRESO',
      });
    }

    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre,
        tipo,
      },
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al crear la categoría',
    });
  }
};

module.exports = {
  obtenerCategorias,
  crearCategoria,
};