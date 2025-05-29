const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Genera token de acceso
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// Verifica token y retorna el payload o lanza error
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { signToken, verifyToken };
