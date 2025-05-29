// routes/roles.routes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const RolesController = require('../controllers/roles.controller');

// Listar roles (cualquier usuario autenticado)
router.get('/', authenticate, RolesController.listar);

// Crear nuevo rol (solo admin)
router.post('/', authenticate, RolesController.crear);

// Editar nombre de rol (solo admin)
router.put('/:id', authenticate, RolesController.actualizar);

// Eliminar (marcar deleted_at) rol (solo admin)
router.delete('/:id', authenticate, RolesController.eliminar);

module.exports = router;

