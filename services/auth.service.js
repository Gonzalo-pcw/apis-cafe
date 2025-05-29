const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function registerUser({ nombre, email, password, phone, rol_id }) {
  const [exists] = await pool.query('SELECT 1 FROM usuarios WHERE email = ?', [email]);
  if (exists.length) throw new Error('EMAIL_EXISTS');
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    `INSERT INTO usuarios (rol_id,nombre,email,password_hash,phone,verified)
     VALUES (?,?,?,?,?,?)`,
    [rol_id || 1, nombre, email, hash, phone || null, false]
  );
  return result.insertId;
}

async function validateCredentials(email, password) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
  if (!rows.length) throw new Error('INVALID_CREDENTIALS');
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) throw new Error('INVALID_CREDENTIALS');
  return { id: user.id, nombre: user.nombre, email: user.email, rol_id: user.rol_id };
}

module.exports = { registerUser, validateCredentials };
