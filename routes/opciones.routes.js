const express = require('express');
const router = express.Router();
const controller = require('../controllers/opcion.controller');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, controller.list);
router.post('/', authenticate, controller.create);

router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.softDelete);

// Opcional para valores individuales
router.delete('/valor/:id', authenticate, controller.deleteValor);
router.put('/valor/:id', authenticate, controller.updateValor);

module.exports = router;
