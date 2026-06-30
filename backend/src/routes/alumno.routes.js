const express = require('express');
const {
  obtenerAlumnos,
  obtenerAlumnoPorDni,
  crearAlumno,
  obtenerPerfilCuotasPorDni,
  actualizarAlumno,
  buscarAlumnos,
} = require('../controllers/alumno.controller');

const router = express.Router();

router.get('/', obtenerAlumnos);
router.get('/dni/:dni/cuotas', obtenerPerfilCuotasPorDni);
router.get('/dni/:dni', obtenerAlumnoPorDni);
router.post('/', crearAlumno);
router.put('/:id', actualizarAlumno);
router.get('/buscar', buscarAlumnos);

module.exports = router;