const express = require('express');
const router = express.Router();
const ResenaController = require('../controllers/resena.controller');
const authenticate = require('../middlewares/auth');
const audit = require('../middlewares/audit');

// Crear reseña (requiere usuario autenticado)
router.post('/', authenticate, audit('crear', 'resenas'), ResenaController.crear);

// Listar reseñas por producto (público)
router.get('/producto/:id', ResenaController.listarPorProducto);

// Listar reseñas por usuario (solo el usuario puede ver las suyas)
router.get('/usuario/:id', authenticate, ResenaController.listarPorUsuario);

// Editar reseña (dueño solo)
router.put('/:id', authenticate, audit('actualizar', 'resenas'), ResenaController.editar);

// Eliminar reseña (dueño o admin)
router.delete('/:id', authenticate, audit('eliminar', 'resenas'), ResenaController.eliminar);

module.exports = router;

