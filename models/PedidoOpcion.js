// models/PedidoOpcion.js
const db = require('../config/db');

const PedidoOpcion = {
  // Crear una opción (extra) asociada a un detalle
  async create(detalle_id, valor_opcion_id) {
    await db.query(
      'INSERT INTO pedido_opciones (detalle_id, valor_opcion_id, created_at) VALUES (?, ?, NOW())',
      [detalle_id, valor_opcion_id]
    );
  },

  // Listar todas las opciones (extras) activas de un detalle
  async findByDetalleId(detalle_id) {
    const [rows] = await db.query(
      `SELECT 
         po.valor_opcion_id, 
         vo.valor AS nombre_valor, 
         vo.precio_extra, 
         po.created_at 
       FROM pedido_opciones po
       JOIN opciones_valores vo 
         ON po.valor_opcion_id = vo.id
       WHERE po.detalle_id = ? 
         AND po.deleted_at IS NULL`,
      [detalle_id]
    );
    return rows;
  },

  // Soft-delete de todas las opciones de un detalle
  async deleteByDetalleId(detalle_id) {
    const [result] = await db.query(
      'UPDATE pedido_opciones SET deleted_at = NOW() WHERE detalle_id = ? AND deleted_at IS NULL',
      [detalle_id]
    );
    return result.affectedRows > 0;
  },

  // Soft-delete de una opción específica de un detalle
  async delete(detalle_id, valor_opcion_id) {
    const [result] = await db.query(
      'UPDATE pedido_opciones SET deleted_at = NOW() WHERE detalle_id = ? AND valor_opcion_id = ? AND deleted_at IS NULL',
      [detalle_id, valor_opcion_id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = PedidoOpcion;


