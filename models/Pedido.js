// models/Pedido.js
const db = require('../config/db');
const PedidoOpcion = require('./PedidoOpcion');

const Pedido = {
  async findAll() {
    const [rows] = await db.query(
      'SELECT * FROM pedidos WHERE deleted_at IS NULL'
    );
    for (const pedido of rows) {
      const [detalles] = await db.query(
        'SELECT * FROM detalle_pedidos WHERE pedido_id = ? AND deleted_at IS NULL',
        [pedido.id]
      );
      // Adjuntar las opciones a cada detalle
      for (const detalle of detalles) {
        const opciones = await PedidoOpcion.findByDetalleId(detalle.id);
        detalle.opciones = opciones;
      }
      pedido.detalles = detalles;
    }
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM pedidos WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    if (rows.length === 0) return null;

    const pedido = rows[0];

    const [detalles] = await db.query(
      'SELECT * FROM detalle_pedidos WHERE pedido_id = ? AND deleted_at IS NULL',
      [id]
    );
    // Adjuntar las opciones a cada detalle
    for (const detalle of detalles) {
      const opciones = await PedidoOpcion.findByDetalleId(detalle.id);
      detalle.opciones = opciones;
    }
    pedido.detalles = detalles;

    return pedido;
  },

  async create(usuario_id, total, tipo_entrega, horario_entrega, direccion_envio) {
    const [result] = await db.query(
      `INSERT INTO pedidos 
        (usuario_id, total, tipo_entrega, horario_entrega, direccion_envio, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [usuario_id, total, tipo_entrega, horario_entrega, direccion_envio]
    );
    return { id: result.insertId };
  },

  async update(id, estado, tipo_entrega, horario_entrega, direccion_envio) {
    const [result] = await db.query(
      `UPDATE pedidos 
         SET estado = ?, 
             tipo_entrega = ?, 
             horario_entrega = ?, 
             direccion_envio = ?, 
             updated_at = NOW() 
       WHERE id = ? 
         AND deleted_at IS NULL`,
      [estado, tipo_entrega, horario_entrega, direccion_envio, id]
    );
    return result.affectedRows > 0;
  },

  async softDelete(id) {
    const [result] = await db.query(
      'UPDATE pedidos SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Pedido;

