// middlewares/auth.js
const { verifyToken } = require('../utils/jwt.util');

function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'Sin token' });
  const token = header.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = authenticate;
