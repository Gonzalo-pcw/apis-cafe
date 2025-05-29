const db = require('../config/db');

const Notificacion = {
  findAllByUser: async (usuario_id) => {
    const [rows] = await db.query(
      `SELECT * FROM notificaciones WHERE usuario_id = ? AND deleted_at IS NULL ORDER BY created_at DESC`,
      [usuario_id]
    );
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query(`SELECT * FROM notificaciones WHERE id = ? AND deleted_at IS NULL`, [id]);
    return rows[0];
  },

  create: async ({ usuario_id, tipo, contenido }) => {
    const [result] = await db.query(
      `INSERT INTO notificaciones (usuario_id, tipo, contenido) VALUES (?, ?, ?)`,
      [usuario_id, tipo, contenido]
    );
    return { id: result.insertId };
  },

  marcarLeido: async (id, usuario_id) => {
    await db.query(`UPDATE notificaciones SET leido = 1 WHERE id = ? AND usuario_id = ?`, [id, usuario_id]);
  },

  delete: async (id, usuario_id) => {
    await db.query(
      `UPDATE notificaciones SET deleted_at = NOW() WHERE id = ? AND usuario_id = ?`,
      [id, usuario_id]
    );
  },
};

module.exports = Notificacion;
