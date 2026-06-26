const express = require('express');
const {
  registrarPagoCuota,
  obtenerPagosCuotas,
} = require('../controllers/pagoCuota.controller');

const router = express.Router();

router.get('/', obtenerPagosCuotas);
router.post('/', registrarPagoCuota);

module.exports = router;