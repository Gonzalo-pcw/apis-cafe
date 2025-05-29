const db = require('../config/db');

const DetallePedido = {
  async create(pedido_id, producto_id, cantidad, precio_unitario) {
    const subtotal = cantidad * precio_unitario;
    const [result] = await db.query(
      'INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [pedido_id, producto_id, cantidad, precio_unitario, subtotal]
    );
    return { id: result.insertId };
  },

  async findByPedidoId(pedido_id) {
    const [rows] = await db.query(
      'SELECT * FROM detalle_pedidos WHERE pedido_id = ? AND deleted_at IS NULL',
      [pedido_id]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM detalle_pedidos WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return rows[0] || null;
  },

  async softDelete(id) {
    const [result] = await db.query(
      'UPDATE detalle_pedidos SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return result.affectedRows > 0;
  },

  async update(id, cantidad, precio_unitario) {
    const subtotal = cantidad * precio_unitario;
    const [result] = await db.query(
      'UPDATE detalle_pedidos SET cantidad = ?, precio_unitario = ?, subtotal = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [cantidad, precio_unitario, subtotal, id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = DetallePedido;

