const express = require('express'); 
const router = express.Router();
const controller = require('../controllers/pedido.controller');
const authenticate = require('../middlewares/auth');
const audit = require('../middlewares/audit');

// Rutas protegidas con autenticación y auditoría donde aplica
router.get('/', authenticate, controller.list);
router.post('/', authenticate, audit('crear', 'pedidos'), controller.create);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, audit('actualizar', 'pedidos'), controller.update);
router.delete('/:id', authenticate, audit('eliminar', 'pedidos'), controller.softDelete);

module.exports = router;


