// server.js
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', require('./routes/auth.routes'));

// Rutas de pedidos (protegidas con JWT)
// ← Aquí apuntamos a 'pedidos.routes.js' en lugar de 'order.routes.js'
app.use('/api/pedidos', require('./routes/pedidos.routes'));

// Rutas de detalles de pedidos (por ID de pedido)
app.use('/api/pedidos/:pedidoId/detalles', require('./routes/detalles.routes'));

// Rutas de categorías
const categoryRoutes = require('./routes/category.routes');
app.use('/api/categories', categoryRoutes);

// Rutas de productos
const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

// Rutas de opciones de personalización (Tamaño, Extras, etc.)
app.use('/api/opciones', require('./routes/opciones.routes'));

// Rutas de reseñas
app.use('/api/resenas', require('./routes/resenas.routes'));

// Rutas de historial
app.use('/api/historial', require('./routes/historial.routes'));

// Rutas de pagos
app.use('/api/pagos', require('./routes/pagos.routes'));

// Rutas de roles
app.use('/api/roles', require('./routes/roles.routes'));

// Rutas de notificaciones
const notificacionesRoutes = require('./routes/notificaciones.routes');
app.use('/api/notificaciones', notificacionesRoutes);

// Rutas de Auditoría (audit_logs)
const auditoriaRoutes = require('./routes/auditoria.routes');
app.use('/api/auditoria', auditoriaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});



