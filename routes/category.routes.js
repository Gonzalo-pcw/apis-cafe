const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const audit = require('../middlewares/audit');
const categoryController = require('../controllers/category.controller');

router.post('/', authenticate, audit('crear', 'categorias'), categoryController.create);
router.get('/', authenticate, categoryController.list);
router.get('/:id', authenticate, categoryController.getById);
router.put('/:id', authenticate, audit('actualizar', 'categorias'), categoryController.update);
router.delete('/:id', authenticate, audit('eliminar', 'categorias'), categoryController.remove);

module.exports = router;

