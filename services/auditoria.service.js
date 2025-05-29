const db = require('../config/db');

const registrarLog = async ({ usuario_id, accion, tabla, registro_id, detalles, ip_address }) => {
  const query = `
    INSERT INTO audit_logs (usuario_id, accion, tabla, registro_id, detalles, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  await db.execute(query, [usuario_id, accion, tabla, registro_id, JSON.stringify(detalles), ip_address]);
};

const obtenerTodos = async () => {
  const [result] = await db.execute(`SELECT * FROM audit_logs ORDER BY fecha DESC`);
  return result;
};

module.exports = {
  registrarLog,
  obtenerTodos
};
