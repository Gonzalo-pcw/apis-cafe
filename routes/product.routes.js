const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const audit = require('../middlewares/audit');
const productController = require('../controllers/product.controller');

// Crear producto (audit) 
router.post('/',
  authenticate,
  audit('CREAR PRODUCTO', 'productos'),
  productController.create
);

// Listar productos (público)
router.get('/',
  // no audit para lecturas públicas
  productController.list
);

// Obtener producto por ID (público)
router.get('/:id',
  productController.getById
);

// Actualizar producto (audit)
router.put('/:id',
  authenticate,
  audit('ACTUALIZAR PRODUCTO', 'productos'),
  productController.update
);

// Eliminar producto (audit)
router.delete('/:id',
  authenticate,
  audit('ELIMINAR PRODUCTO', 'productos'),
  productController.remove
);

module.exports = router;


