const DetallePedido = require('../models/DetallePedido');
const PedidoOpcion = require('../models/PedidoOpcion');

// GET /api/pedidos/:pedidoId/detalles
exports.listDetalles = async (req, res) => {
  const { pedidoId } = req.params;
  try {
    const detalles = await DetallePedido.findByPedidoId(pedidoId);
    res.json(detalles);
  } catch (error) {
    console.error('Error al obtener detalles:', error);
    res.status(500).json({ message: 'Error al obtener detalles' });
  }
};

// GET /api/pedidos/:pedidoId/detalles/:detalleId
exports.getDetalle = async (req, res) => {
  const { detalleId } = req.params;
  try {
    const detalle = await DetallePedido.findById(detalleId);
    if (!detalle) return res.status(404).json({ message: 'Detalle no encontrado' });
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el detalle' });
  }
};

// GET /api/pedidos/:pedidoId/detalles/:detalleId/opciones
exports.getOpciones = async (req, res) => {
  const { detalleId } = req.params;
  try {
    const opciones = await PedidoOpcion.findByDetalleId(detalleId);
    res.json(opciones);
  } catch (error) {
    console.error('Error al obtener opciones:', error);
    res.status(500).json({ message: 'Error al obtener opciones' });
  }
};
