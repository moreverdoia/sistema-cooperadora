const express = require('express');
const {
  obtenerCursos,
  crearCurso,
  obtenerEstadoCuotasPorCurso,
} = require('../controllers/curso.controller');

const router = express.Router();

router.get('/', obtenerCursos);
router.get('/:id/cuotas', obtenerEstadoCuotasPorCurso);
router.post('/', crearCurso);

module.exports = router;