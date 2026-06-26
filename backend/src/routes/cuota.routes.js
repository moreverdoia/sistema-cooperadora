const express = require('express');
const {
  obtenerCuotas,
  crearCuota,
} = require('../controllers/cuota.controller');

const router = express.Router();

router.get('/', obtenerCuotas);
router.post('/', crearCuota);

module.exports = router;