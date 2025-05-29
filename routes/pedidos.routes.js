const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedido.controller');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, controller.list);
router.post('/', authenticate, controller.create);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.softDelete);

module.exports = router;