const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const PagosController = require('../controllers/pagos.controller');

// Crear pago para pedido (usuario autenticado)
router.post('/', authenticate, PagosController.crear);

// Listar pagos de un pedido (usuario o admin)
router.get('/pedido/:pedidoId', authenticate, PagosController.listarPorPedido);

// Actualizar estado pago (solo admin)
router.put('/:id/estado', authenticate, PagosController.actualizarEstado);

// Eliminar pago (solo admin)
router.delete('/:id', authenticate, PagosController.eliminar);

module.exports = router;

//Que pendiente a revisar