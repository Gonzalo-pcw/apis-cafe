const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const audit = require('../middlewares/audit');
const RolesController = require('../controllers/roles.controller');

// Listar roles (cualquier usuario autenticado)
router.get('/', authenticate, RolesController.listar);

// Crear nuevo rol (solo admin)
router.post('/', authenticate, audit('crear', 'roles'), RolesController.crear);

// Editar nombre de rol (solo admin)
router.put('/:id', authenticate, audit('actualizar', 'roles'), RolesController.actualizar);

// Eliminar rol (solo admin)
router.delete('/:id', authenticate, audit('eliminar', 'roles'), RolesController.eliminar);

module.exports = router;


