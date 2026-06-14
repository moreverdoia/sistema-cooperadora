const express = require('express');
const cors = require('cors');
require('dotenv').config();

const categoriaRoutes = require('./routes/categoria.routes');
const movimientoRoutes = require('./routes/movimiento.routes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/categorias', categoriaRoutes);
app.use('/api/movimientos', movimientoRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'API del sistema de cooperadora funcionando correctamente',
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});