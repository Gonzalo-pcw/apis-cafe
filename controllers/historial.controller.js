const db = require('../config/db');

const HistorialController = {
  async obtenerHistorial(req, res) {
    const usuario_id = req.user.id;
    const [pedidos] = await db.query(
      `SELECT p.*, dp.producto_id, dp.cantidad, dp.subtotal, pr.nombre AS producto_nombre
       FROM pedidos p
       JOIN detalle_pedidos dp ON p.id = dp.pedido_id
       JOIN productos pr ON dp.producto_id = pr.id
       WHERE p.usuario_id = ? AND p.deleted_at IS NULL
       ORDER BY p.created_at DESC`,
      [usuario_id]
    );

    res.json(pedidos);
  }
};

module.exports = HistorialController;

