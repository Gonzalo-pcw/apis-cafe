const db = require('../config/db');

const OpcionValor = {
  async create(opcion_id, valor, precio_extra) {
    const [result] = await db.query(
      'INSERT INTO opciones_valores (opcion_id, valor, precio_extra, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [opcion_id, valor, precio_extra]
    );
    return { id: result.insertId, opcion_id, valor, precio_extra };
  },

  async update(id, valor, precio_extra) {
    const [result] = await db.query(
      'UPDATE opciones_valores SET valor = ?, precio_extra = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [valor, precio_extra, id]
    );
    return result.affectedRows > 0;
  },

  async softDelete(id) {
    const [result] = await db.query(
      'UPDATE opciones_valores SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = OpcionValor;
