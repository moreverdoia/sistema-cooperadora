const express = require('express');
const {
  obtenerCategorias,
  crearCategoria,
} = require('../controllers/categoria.controller');

const router = express.Router();

router.get('/', obtenerCategorias);
router.post('/', crearCategoria);

module.exports = router;