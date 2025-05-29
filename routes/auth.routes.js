// routes/auth.routes.js
const express = require('express');
const router  = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register',      authController.register);
router.post('/login',         authController.login);
router.post('/verify-token',  authController.verifyToken);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
