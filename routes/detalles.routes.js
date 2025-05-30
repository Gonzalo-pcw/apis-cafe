// routes/detalles.routes.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/detalle.controller');
const authenticate = require('../middlewares/auth');

// Solo lectura (GET)
router.get('/', authenticate, controller.listDetalles);
router.get('/:detalleId', authenticate, controller.getDetalle);
router.get('/:detalleId/opciones', authenticate, controller.getOpciones);

// CRUD incremental para el carrito (detalles)
router.post('/', authenticate, controller.createDetalle);
router.put('/:detalleId', authenticate, controller.updateDetalle);
router.delete('/:detalleId', authenticate, controller.deleteDetalle);

module.exports = router;

