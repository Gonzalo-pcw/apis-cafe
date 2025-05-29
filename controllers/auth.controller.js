const { registerUser, validateCredentials } = require('../services/auth.service');
const { signToken, verifyToken } = require('../utils/jwt.util');

exports.register = async (req, res) => {
  try {
    const userId = await registerUser(req.body);
    res.status(201).json({ userId });
  } catch (err) {
    if (err.message === 'EMAIL_EXISTS') {
      return res.status(400).json({ message: 'Email ya registrado' });
    }
    console.error(err);
    res.status(500).json({ message: 'Error interno' });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await validateCredentials(req.body.email, req.body.password);
    const token = signToken({ id: user.id, email: user.email, rol_id: user.rol_id });
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Credenciales inválidas' });
  }
};

// Verifica que un token JWT siga siendo válido
exports.verifyToken = (req, res) => {
  try {
    const { token } = req.body;
    const payload = verifyToken(token);
    res.json({ valid: true, payload });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Token inválido o expirado' });
  }
};

// Emite un nuevo token a partir de uno válido (mismo payload)
exports.refreshToken = (req, res) => {
  try {
    const { token } = req.body;
    const payload = verifyToken(token);         // si expira aquí, catch devolverá 401
    delete payload.iat;
    delete payload.exp;
    const newToken = signToken(payload);
    res.json({ token: newToken });
  } catch (err) {
    res.status(401).json({ message: 'No se pudo refrescar: token inválido o expirado' });
  }
};
