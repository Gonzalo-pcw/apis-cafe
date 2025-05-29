// routes/order.routes.js
//const express = require('express');
//const router = express.Router();
//const orderController = require('../controllers/order.controller');
//const authenticate = require('../middlewares/auth');

//router.post('/',   authenticate, orderController.create);
//router.get('/',    authenticate, orderController.list);
//router.put('/:id', authenticate, orderController.update);
//router.delete('/:id', authenticate, orderController.remove);

//module.exports = router;

const express = require('express'); 
const router = express.Router();
const controller = require('../controllers/pedido.controller');
const authenticate = require('../middlewares/auth');

// Rutas protegidas con autenticación
router.get('/', authenticate, controller.list);
router.post('/', authenticate, controller.create);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, controller.update); // <- Corregido aquí
router.delete('/:id', authenticate, controller.softDelete);

module.exports = router;

