const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const audit = require('../middlewares/audit');
const controller = require('../controllers/notificacion.controller');

router.get('/', auth, controller.listar);
router.post('/', auth, audit('crear', 'notificaciones'), controller.crear);
router.put('/:id/leido', auth, audit('actualizar', 'notificaciones'), controller.marcarLeido);
router.delete('/:id', auth, audit('eliminar', 'notificaciones'), controller.eliminar);

module.exports = router;


