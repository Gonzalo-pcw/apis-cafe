const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/auth');
const categoryController = require('../controllers/category.controller');

router.post('/',    authenticate, categoryController.create);
router.get('/',     authenticate, categoryController.list);
router.get('/:id',  authenticate, categoryController.getById);
router.put('/:id',  authenticate, categoryController.update);
router.delete('/:id', authenticate, categoryController.remove);

module.exports = router;
