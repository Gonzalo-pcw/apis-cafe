const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const productController = require('../controllers/product.controller');

router.post('/',    authenticate, productController.create);
router.get('/',     productController.list);           // público
router.get('/:id',  productController.getById);        // público
router.put('/:id',  authenticate, productController.update);
router.delete('/:id', authenticate, productController.remove);

module.exports = router;
