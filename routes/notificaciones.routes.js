const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/notificacion.controller');

router.get('/', auth, controller.listar);
router.post('/', auth, controller.crear);
router.put('/:id/leido', auth, controller.marcarLeido);
router.delete('/:id', auth, controller.eliminar);

module.exports = router;
