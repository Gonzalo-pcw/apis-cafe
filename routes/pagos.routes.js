const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const audit = require('../middlewares/audit');
const PagosController = require('../controllers/pagos.controller');

// Crear pago para pedido (usuario autenticado)
router.post('/', authenticate, audit('crear', 'pagos'), PagosController.crear);

// Listar pagos de un pedido (usuario o admin)
router.get('/pedido/:pedidoId', authenticate, PagosController.listarPorPedido);

// Actualizar estado pago (solo admin)
router.put('/:id/estado', authenticate, audit('actualizar', 'pagos'), PagosController.actualizarEstado);

// Eliminar pago (solo admin)
router.delete('/:id', authenticate, audit('eliminar', 'pagos'), PagosController.eliminar);

module.exports = router;
