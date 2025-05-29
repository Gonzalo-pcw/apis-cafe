const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/detalle.controller');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, controller.listDetalles);
router.get('/:detalleId', authenticate, controller.getDetalle);
router.get('/:detalleId/opciones', authenticate, controller.getOpciones);

module.exports = router;
