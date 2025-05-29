// middlewares/auth.js
const { verifyToken } = require('../utils/jwt.util');

function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ message: 'Sin token' });
  }

  // Esperamos algo como "Bearer <token>"
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token inválido' });
  }

  const token = parts[1];

  try {
    // 1) Verificamos el token y obtenemos el payload
    const payload = verifyToken(token);

    // 2) Anotamos un flag admin para simplificar chequeos posteriores
    payload.admin = payload.rol_id === 3;

    // 3) Lo dejamos en req.user para los controladores
    req.user = payload;

    // 4) Pasamos al siguiente middleware / ruta
    next();
  } catch (err) {
    console.error('Error en auth middleware:', err.message);
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// No olvides exportar la función
module.exports = authenticate;
