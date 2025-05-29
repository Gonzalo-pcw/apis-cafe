const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const controller = require('../controllers/auditoria.controller');

// Solo administradores pueden ver los logs
router.get('/', auth, (req, res, next) => {
  if (!req.user.admin) return res.status(403).json({ message: 'No autorizado' });
  next();
}, controller.listarLogs);

module.exports = router;
