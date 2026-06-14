const express = require('express');
const {
  obtenerMovimientos,
  obtenerMovimientoPorId,
  crearMovimiento,
  actualizarMovimiento,
  eliminarMovimiento,
  obtenerResumenMovimientos,
} = require('../controllers/movimiento.controller');

const router = express.Router();

router.get('/resumen', obtenerResumenMovimientos);
router.get('/', obtenerMovimientos);
router.get('/:id', obtenerMovimientoPorId);
router.post('/', crearMovimiento);
router.put('/:id', actualizarMovimiento);
router.delete('/:id', eliminarMovimiento);

module.exports = router;