const express = require('express');
const cors = require('cors');
require('dotenv').config();

const categoriaRoutes = require('./routes/categoria.routes');
const movimientoRoutes = require('./routes/movimiento.routes');
const cursoRoutes = require('./routes/curso.routes');
const alumnoRoutes = require('./routes/alumno.routes');
const cuotaRoutes = require('./routes/cuota.routes');
const pagoCuotaRoutes = require('./routes/pagoCuota.routes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/categorias', categoriaRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/alumnos', alumnoRoutes);
app.use('/api/cuotas', cuotaRoutes);
app.use('/api/pagos-cuotas', pagoCuotaRoutes);

const usuarios = [
  {
    username: 'preceptor',
    password: '1234',
    rol: 'preceptor',
  },
  {
    username: 'cooperadora',
    password: '1234',
    rol: 'cooperadora',
  },
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const usuario = usuarios.find(
    (u) =>
      u.username === username &&
      u.password === password
  );

  if (!usuario) {
    return res.status(401).json({
      error: 'Usuario o contraseña incorrectos',
    });
  }

  res.json({
    username: usuario.username,
    rol: usuario.rol,
  });
});


app.get('/', (req, res) => {
  res.json({
    message: 'API del sistema de cooperadora funcionando correctamente',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});