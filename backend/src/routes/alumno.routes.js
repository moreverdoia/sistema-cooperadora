const express = require('express');
const {
  obtenerAlumnos,
  obtenerAlumnoPorDni,
  crearAlumno,
  obtenerPerfilCuotasPorDni,
} = require('../controllers/alumno.controller');

const router = express.Router();

router.get('/', obtenerAlumnos);
router.get('/dni/:dni/cuotas', obtenerPerfilCuotasPorDni);
router.get('/dni/:dni', obtenerAlumnoPorDni);
router.post('/', crearAlumno);

module.exports = router;