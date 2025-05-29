const Pedido = require('../models/Pedido');
const DetallePedido = require('../models/DetallePedido');
const PedidoOpcion = require('../models/PedidoOpcion');

// Obtener todos los pedidos
exports.list = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    console.error('[LIST] Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

// Crear un nuevo pedido con sus detalles y opciones
exports.create = async (req, res) => {
  try {
    const { usuario_id, tipo_entrega, horario_entrega, direccion_envio, detalles } = req.body;

    // Validación básica
    if (!usuario_id || !tipo_entrega || !Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ message: 'Datos insuficientes para crear el pedido' });
    }

    // Calcular total dinámico
    let total = 0;
    for (const item of detalles) {
      if (!item.producto_id || !item.precio_unitario || !item.cantidad) {
        return res.status(400).json({ message: 'Cada detalle debe tener producto_id, cantidad y precio_unitario' });
      }
      total += item.cantidad * item.precio_unitario;
    }

    // Crear el pedido principal
    const pedido = await Pedido.create(usuario_id, total, tipo_entrega, horario_entrega, direccion_envio);

    // Crear los detalles y sus opciones
    for (const item of detalles) {
      const detalle = await DetallePedido.create(
        pedido.id,
        item.producto_id,
        item.cantidad,
        item.precio_unitario
      );

      // Insertar las opciones (si las hay)
      if (Array.isArray(item.opciones)) {
        for (const opcion_id of item.opciones) {
          await PedidoOpcion.create(detalle.id, opcion_id);
        }
      }
    }

    const pedidoCompleto = await Pedido.findById(pedido.id);
    res.status(201).json({ message: 'Pedido creado exitosamente', pedido: pedidoCompleto });
  } catch (error) {
    console.error('[CREATE] Error al crear pedido:', error);
    res.status(500).json({ message: 'Error interno al crear el pedido' });
  }
};

// Obtener un pedido por su ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findById(id);
    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    console.error('[GET] Error al obtener pedido:', error);
    res.status(500).json({ message: 'Error al obtener pedido' });
  }
};

// Actualizar un pedido existente (solo campos permitidos)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, tipo_entrega, horario_entrega, direccion_envio } = req.body;

    const existe = await Pedido.findById(id);
    if (!existe) return res.status(404).json({ message: 'Pedido no encontrado' });

    await Pedido.update(id, estado, tipo_entrega, horario_entrega, direccion_envio);

    const actualizado = await Pedido.findById(id);
    res.json({ message: 'Pedido actualizado exitosamente', pedido: actualizado });
  } catch (error) {
    console.error('[UPDATE] Error al actualizar pedido:', error);
    res.status(500).json({ message: 'Error al actualizar pedido' });
  }
};

// Eliminar un pedido (borrado lógico)
exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const existe = await Pedido.findById(id);
    if (!existe) return res.status(404).json({ message: 'Pedido no encontrado' });

    await Pedido.softDelete(id);
    res.json({ message: 'Pedido eliminado (borrado lógico)' });
  } catch (error) {
    console.error('[DELETE] Error al eliminar pedido:', error);
    res.status(500).json({ message: 'Error al eliminar pedido' });
  }
};
