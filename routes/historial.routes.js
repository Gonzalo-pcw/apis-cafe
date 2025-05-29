const express = require('express');
const router = express.Router();
const HistorialController = require('../controllers/historial.controller');
const authenticate = require('../middlewares/auth');

router.get('/', authenticate, HistorialController.obtenerHistorial);

module.exports = router;

