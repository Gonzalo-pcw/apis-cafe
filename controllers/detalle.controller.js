// controllers/detalle.controller.js
const db = require('../config/db');
const DetallePedido = require('../models/DetallePedido');
const PedidoOpcion  = require('../models/PedidoOpcion');
const OpcionValor   = require('../models/OpcionValor');

// GET /api/pedidos/:pedidoId/detalles
exports.listDetalles = async (req, res) => {
  const { pedidoId } = req.params;
  try {
    // Verificar que el pedido exista
    const [pedidoRows] = await db.query(
      'SELECT id FROM pedidos WHERE id = ? AND deleted_at IS NULL',
      [pedidoId]
    );
    if (pedidoRows.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // Traer todos los detalles del pedido
    const detalles = await DetallePedido.findByPedidoId(pedidoId);
    res.json(detalles);
  } catch (error) {
    console.error('Error al obtener detalles:', error);
    res.status(500).json({ message: 'Error al obtener detalles' });
  }
};

// GET /api/pedidos/:pedidoId/detalles/:detalleId
exports.getDetalle = async (req, res) => {
  const { pedidoId, detalleId } = req.params;
  try {
    // Verificar que el detalle exista y pertenezca al pedido
    const detalle = await DetallePedido.findById(detalleId);
    if (!detalle || detalle.pedido_id.toString() !== pedidoId) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }
    res.json(detalle);
  } catch (error) {
    console.error('Error al obtener el detalle:', error);
    res.status(500).json({ message: 'Error al obtener el detalle' });
  }
};

// GET /api/pedidos/:pedidoId/detalles/:detalleId/opciones
exports.getOpciones = async (req, res) => {
  const { pedidoId, detalleId } = req.params;
  try {
    // Verificar que el detalle exista y pertenezca al pedido
    const detalle = await DetallePedido.findById(detalleId);
    if (!detalle || detalle.pedido_id.toString() !== pedidoId) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }

    const opciones = await PedidoOpcion.findByDetalleId(detalleId);
    res.json(opciones);
  } catch (error) {
    console.error('Error al obtener opciones:', error);
    res.status(500).json({ message: 'Error al obtener opciones' });
  }
};

// POST /api/pedidos/:pedidoId/detalles
// Agregar un nuevo detalle (producto + cantidad + precio_unitario + extras) al pedido
exports.createDetalle = async (req, res) => {
  const { pedidoId } = req.params;
  const { producto_id, cantidad, precio_unitario, opciones = [] } = req.body;

  // Validaciones mínimas
  if (!producto_id || cantidad == null || precio_unitario == null) {
    return res.status(400).json({
      message: 'Faltan campos obligatorios: producto_id, cantidad, precio_unitario'
    });
  }

  try {
    // 1) Verificar que el pedido exista
    const [pedidoRows] = await db.query(
      'SELECT id FROM pedidos WHERE id = ? AND deleted_at IS NULL',
      [pedidoId]
    );
    if (pedidoRows.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // 2) Verificar que el producto exista
    const [prodRows] = await db.query(
      'SELECT id FROM productos WHERE id = ? AND deleted_at IS NULL',
      [producto_id]
    );
    if (prodRows.length === 0) {
      return res.status(400).json({ message: 'Producto no encontrado' });
    }

    // 3) Crear el detalle principal y obtener su ID
    const { id: detalleId } = await DetallePedido.create(
      pedidoId,
      producto_id,
      cantidad,
      precio_unitario
    );

    // 4) Si vienen extras, validar cada valor_opcion_id y crearlo
    if (Array.isArray(opciones)) {
      for (const valorOpcionId of opciones) {
        // Verificar existencia de la opción de valor
        const [valRows] = await db.query(
          'SELECT id FROM opciones_valores WHERE id = ? AND deleted_at IS NULL',
          [valorOpcionId]
        );
        if (valRows.length === 0) {
          // Si alguna opción no existe, revertir la inserción del detalle
          await DetallePedido.softDelete(detalleId);
          return res.status(400).json({
            message: `Opción con ID ${valorOpcionId} no encontrada`
          });
        }
        // Insertar la opción (extra) en pedido_opciones
        await PedidoOpcion.create(detalleId, valorOpcionId);
      }
    }

    return res.status(201).json({ id: detalleId });
  } catch (error) {
    console.error('Error al crear detalle:', error);
    return res.status(500).json({ message: 'Error al crear detalle' });
  }
};

// PUT /api/pedidos/:pedidoId/detalles/:detalleId
// Actualizar un detalle existente (cantidad, precio_unitario, sincronizar extras)
exports.updateDetalle = async (req, res) => {
  const { pedidoId, detalleId } = req.params;
  const { cantidad, precio_unitario, opciones = [] } = req.body;

  // Validaciones básicas
  if (cantidad == null || precio_unitario == null) {
    return res.status(400).json({
      message: 'Debes enviar cantidad y precio_unitario'
    });
  }

  try {
    // 1) Verificar que el detalle exista y pertenezca al pedido
    const detalle = await DetallePedido.findById(detalleId);
    if (!detalle || detalle.pedido_id.toString() !== pedidoId) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }

    // 2) Actualizar campos básicos en detalle_pedidos
    const actualizado = await DetallePedido.update(
      detalleId,
      cantidad,
      precio_unitario
    );
    if (!actualizado) {
      return res
        .status(500)
        .json({ message: 'Error al actualizar datos del detalle' });
    }

    // 3) Sincronizar las opciones (pedido_opciones):
    //    a) Obtener lista de valor_opcion_id actuales en BD para este detalle
    const actuales = await PedidoOpcion.findByDetalleId(detalleId);
    const idsEnBD = actuales.map(o => o.valor_opcion_id);
    const idsNuevos = Array.isArray(opciones) ? opciones : [];

    //    b) Opciones a agregar: están en idsNuevos pero no en idsEnBD
    const aAgregar = idsNuevos.filter(id => !idsEnBD.includes(id));
    //    c) Opciones a eliminar: están en idsEnBD pero no en idsNuevos
    const aEliminar = idsEnBD.filter(id => !idsNuevos.includes(id));

    // Insertar nuevas opciones
    for (const valorOpcionId of aAgregar) {
      // Verificar existencia de valor_opcion
      const [valRows] = await db.query(
        'SELECT id FROM opciones_valores WHERE id = ? AND deleted_at IS NULL',
        [valorOpcionId]
      );
      if (valRows.length === 0) {
        return res.status(400).json({
          message: `Opción con ID ${valorOpcionId} no encontrada`
        });
      }
      await PedidoOpcion.create(detalleId, valorOpcionId);
    }

    // Soft-delete de las que ya no vienen
    for (const valorOpcionId of aEliminar) {
      await PedidoOpcion.delete(detalleId, valorOpcionId);
    }

    return res.json({ message: 'Detalle y opciones sincronizadas' });
  } catch (error) {
    console.error('Error al actualizar detalle:', error);
    return res.status(500).json({ message: 'Error al actualizar detalle' });
  }
};

// DELETE /api/pedidos/:pedidoId/detalles/:detalleId
// Soft-delete de un detalle y de sus opciones asociadas
exports.deleteDetalle = async (req, res) => {
  const { pedidoId, detalleId } = req.params;
  try {
    // 1) Verificar que el detalle exista y pertenezca al pedido
    const detalle = await DetallePedido.findById(detalleId);
    if (!detalle || detalle.pedido_id.toString() !== pedidoId) {
      return res.status(404).json({ message: 'Detalle no encontrado' });
    }

    // 2) Soft-delete en detalle_pedidos
    const borrado = await DetallePedido.softDelete(detalleId);
    if (!borrado) {
      return res
        .status(500)
        .json({ message: 'Error al eliminar el detalle' });
    }

    // 3) Soft-delete de todas sus opciones asociadas
    await PedidoOpcion.deleteByDetalleId(detalleId);

    return res.json({ message: 'Detalle (y sus opciones) eliminados' });
  } catch (error) {
    console.error('Error al eliminar detalle:', error);
    return res.status(500).json({ message: 'Error al eliminar detalle' });
  }
};

