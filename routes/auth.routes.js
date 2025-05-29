const express = require('express');
const router  = express.Router();
const authController = require('../controllers/auth.controller');
const audit = require('../middlewares/audit');

router.post(
  '/register',
  audit('REGISTRO DE USUARIO', 'usuarios'),
  authController.register
);

router.post(
  '/login',
  audit('INICIO DE SESIÓN', 'usuarios'),
  authController.login
);

router.post('/verify-token',  authController.verifyToken);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;

