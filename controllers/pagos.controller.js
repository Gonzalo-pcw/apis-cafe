const db = require('../config/db');

const PagosController = {
  async crear(req, res) {
    const { pedido_id, metodo, monto, transaccion_id } = req.body;
    const usuario_id = req.user.id;

    // Validar que el pedido existe y pertenece al usuario (o admin)
    const [pedidoCheck] = await db.query(
      `SELECT * FROM pedidos WHERE id = ? AND deleted_at IS NULL`,
      [pedido_id]
    );
    if (!pedidoCheck.length) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    if (pedidoCheck[0].usuario_id !== usuario_id && !req.user.admin) 
      return res.status(403).json({ mensaje: 'No autorizado para pagar este pedido' });

    // Insertar pago con estado 'pendiente' por defecto
    await db.query(
      `INSERT INTO pagos (pedido_id, metodo, monto, transaccion_id) VALUES (?, ?, ?, ?)`,
      [pedido_id, metodo, monto, transaccion_id || null]
    );

    res.status(201).json({ mensaje: 'Pago creado, estado pendiente' });
  },

  async listarPorPedido(req, res) {
    const { pedidoId } = req.params;
    const usuario_id = req.user.id;

    // Validar que el pedido existe y pertenece al usuario (o admin)
    const [pedidoCheck] = await db.query(
      `SELECT * FROM pedidos WHERE id = ? AND deleted_at IS NULL`,
      [pedidoId]
    );
    if (!pedidoCheck.length) return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    if (pedidoCheck[0].usuario_id !== usuario_id && !req.user.admin) 
      return res.status(403).json({ mensaje: 'No autorizado para ver pagos de este pedido' });

    const [pagos] = await db.query(
      `SELECT * FROM pagos WHERE pedido_id = ? AND deleted_at IS NULL`,
      [pedidoId]
    );

    res.json(pagos);
  },

  async actualizarEstado(req, res) {
    const { id } = req.params;
    const { estado_pago } = req.body;

    // Validar estado válido
    const estadosValidos = ['pendiente', 'aprobado', 'rechazado'];
    if (!estadosValidos.includes(estado_pago)) 
      return res.status(400).json({ mensaje: 'Estado de pago inválido' });

    // Solo admin puede cambiar estado
    if (!req.user.admin) return res.status(403).json({ mensaje: 'No autorizado' });

    const [pagoCheck] = await db.query(`SELECT * FROM pagos WHERE id = ?`, [id]);
    if (!pagoCheck.length) return res.status(404).json({ mensaje: 'Pago no encontrado' });

    await db.query(
      `UPDATE pagos SET estado_pago = ?, updated_at = NOW() WHERE id = ?`,
      [estado_pago, id]
    );

    res.json({ mensaje: 'Estado de pago actualizado' });
  },

  async eliminar(req, res) {
    const { id } = req.params;

    // Solo admin puede eliminar
    if (!req.user.admin) return res.status(403).json({ mensaje: 'No autorizado' });

    const [pagoCheck] = await db.query(`SELECT * FROM pagos WHERE id = ?`, [id]);
    if (!pagoCheck.length) return res.status(404).json({ mensaje: 'Pago no encontrado' });

    await db.query(
      `UPDATE pagos SET deleted_at = NOW() WHERE id = ?`,
      [id]
    );

    res.json({ mensaje: 'Pago eliminado' });
  }
};

module.exports = PagosController;
