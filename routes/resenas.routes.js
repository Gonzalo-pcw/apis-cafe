const express = require('express');
const router = express.Router();
const ResenaController = require('../controllers/resena.controller');
const authenticate = require('../middlewares/auth');

// Crear reseña (requiere usuario autenticado)
router.post('/', authenticate, ResenaController.crear);

// Listar reseñas por producto (público)
router.get('/producto/:id', ResenaController.listarPorProducto);

// Listar reseñas por usuario (solo el usuario puede ver las suyas)
router.get('/usuario/:id', authenticate, ResenaController.listarPorUsuario);

// Editar reseña (dueño solo)
router.put('/:id', authenticate, ResenaController.editar);

// Eliminar reseña (dueño o admin)
router.delete('/:id', authenticate, ResenaController.eliminar);

module.exports = router;
