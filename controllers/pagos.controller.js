// controllers/pagos.controller.js
const db = require('../config/db');

const PagosController = {
  async crear(req, res) {
    const { pedido_id, metodo, monto, transaccion_id } = req.body;
    const usuario_id = req.user.id;

    // 1) Validación de campos obligatorios
    if (!pedido_id || !metodo || monto === undefined) {
      return res.status(400).json({
        mensaje: 'Faltan campos obligatorios: pedido_id, metodo o monto'
      });
    }

    // 2) Validar tipo y valor de monto (decimal(10,2) en BD)
    if (typeof monto !== 'number' || isNaN(monto) || monto <= 0) {
      return res.status(400).json({ mensaje: 'El monto debe ser un número positivo' });
    }

    // 3) Validar que el pedido existe y pertenece al usuario (o admin)
    const [pedidoCheck] = await db.query(
      'SELECT * FROM pedidos WHERE id = ? AND deleted_at IS NULL',
      [pedido_id]
    );
    if (!pedidoCheck.length) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    if (pedidoCheck[0].usuario_id !== usuario_id && !req.user.admin) {
      return res.status(403).json({ mensaje: 'No autorizado para pagar este pedido' });
    }

    // 4) Insertar pago con estado 'pendiente' por defecto
    const [result] = await db.query(
      'INSERT INTO pagos (pedido_id, metodo, monto, transaccion_id) VALUES (?, ?, ?, ?)',
      [pedido_id, metodo, monto, transaccion_id || null]
    );

    // 5) Recuperar el pago recién creado
    const insertId = result.insertId;
    const [[nuevoPago]] = await db.query(
      'SELECT * FROM pagos WHERE id = ?',
      [insertId]
    );

    // 6) Devolver mensaje y objeto completo del pago creado
    return res.status(201).json({
      mensaje: 'Pago creado exitosamente',
      pago: nuevoPago
    });
  },

  async listarPorPedido(req, res) {
    const { pedidoId } = req.params;
    const usuario_id = req.user.id;

    // Validar que el pedido existe y pertenece al usuario (o admin)
    const [pedidoCheck] = await db.query(
      'SELECT * FROM pedidos WHERE id = ? AND deleted_at IS NULL',
      [pedidoId]
    );
    if (!pedidoCheck.length) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    if (pedidoCheck[0].usuario_id !== usuario_id && !req.user.admin) {
      return res.status(403).json({ mensaje: 'No autorizado para ver pagos de este pedido' });
    }

    // Listar pagos
    const [pagos] = await db.query(
      'SELECT * FROM pagos WHERE pedido_id = ? AND deleted_at IS NULL',
      [pedidoId]
    );

    return res.json(pagos);
  },

  async actualizarEstado(req, res) {
    const { id } = req.params;
    const { estado_pago } = req.body;

    // Validar estado válido
    const estadosValidos = ['pendiente', 'aprobado', 'rechazado'];
    if (!estadosValidos.includes(estado_pago)) {
      return res.status(400).json({ mensaje: 'Estado de pago inválido' });
    }

    // Solo admin puede cambiar estado
    if (!req.user.admin) {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    // Comprobar existencia del pago
    const [pagoCheck] = await db.query(
      'SELECT * FROM pagos WHERE id = ?',
      [id]
    );
    if (!pagoCheck.length) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }

    // Actualizar estado
    await db.query(
      'UPDATE pagos SET estado_pago = ?, updated_at = NOW() WHERE id = ?',
      [estado_pago, id]
    );

    return res.json({ mensaje: 'Estado de pago actualizado' });
  },

  async eliminar(req, res) {
    const { id } = req.params;

    // Solo admin puede eliminar
    if (!req.user.admin) {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    // Comprobar existencia del pago
    const [pagoCheck] = await db.query(
      'SELECT * FROM pagos WHERE id = ?',
      [id]
    );
    if (!pagoCheck.length) {
      return res.status(404).json({ mensaje: 'Pago no encontrado' });
    }

    // Marcar eliminado
    await db.query(
      'UPDATE pagos SET deleted_at = NOW() WHERE id = ?',
      [id]
    );

    return res.json({ mensaje: 'Pago eliminado' });
  }
};

module.exports = PagosController;
