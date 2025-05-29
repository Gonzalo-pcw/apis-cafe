const db = require('../config/db');

const PedidoOpcion = {
  async create(detalle_id, valor_opcion_id) {
    await db.query(
      'INSERT INTO pedido_opciones (detalle_id, valor_opcion_id, created_at) VALUES (?, ?, NOW())',
      [detalle_id, valor_opcion_id]
    );
  },

  async findByDetalleId(detalle_id) {
    const [rows] = await db.query(
      `SELECT po.*, vo.nombre AS nombre_opcion
       FROM pedido_opciones po
       JOIN valor_opciones vo ON po.valor_opcion_id = vo.id
       WHERE po.detalle_id = ?`,
      [detalle_id]
    );
    return rows;
  },

  async deleteByDetalleId(detalle_id) {
    const [result] = await db.query(
      'DELETE FROM pedido_opciones WHERE detalle_id = ?',
      [detalle_id]
    );
    return result.affectedRows > 0;
  },

  async delete(detalle_id, valor_opcion_id) {
    const [result] = await db.query(
      'DELETE FROM pedido_opciones WHERE detalle_id = ? AND valor_opcion_id = ?',
      [detalle_id, valor_opcion_id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = PedidoOpcion;

