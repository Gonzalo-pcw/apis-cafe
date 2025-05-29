const express = require('express');
const router = express.Router();
const controller = require('../controllers/opcion.controller');
const authenticate = require('../middlewares/auth');
const audit = require('../middlewares/audit');

router.get('/', authenticate, controller.list);
router.post('/', authenticate, audit('crear', 'opciones'), controller.create);

router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, audit('actualizar', 'opciones'), controller.update);
router.delete('/:id', authenticate, audit('eliminar', 'opciones'), controller.softDelete);

// Opcional para valores individuales
router.delete('/valor/:id', authenticate, audit('eliminar', 'valores_opcion'), controller.deleteValor);
router.put('/valor/:id', authenticate, audit('actualizar', 'valores_opcion'), controller.updateValor);

module.exports = router;


