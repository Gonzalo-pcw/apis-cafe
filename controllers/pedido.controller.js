// controllers/pedido.controller.js
const Pedido = require('../models/Pedido');

// Obtener todos los pedidos (incluye ya detalles y opciones anidadas)
exports.list = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll();
    res.json(pedidos);
  } catch (error) {
    console.error('[LIST] Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};

// Crear un nuevo pedido *sin detalles* (flujo incremental)
// El frontend recibirá el pedidoId y luego usará /detalles para poblarlo
exports.create = async (req, res) => {
  try {
    const { usuario_id, tipo_entrega, horario_entrega, direccion_envio } = req.body;

    // Validación básica: ya no esperamos 'detalles' aquí
    if (!usuario_id || !tipo_entrega) {
      return res
        .status(400)
        .json({ message: 'Faltan datos obligatorios: usuario_id, tipo_entrega' });
    }

    // Inicialmente guardamos el pedido con total=0 y sin detalles
    // (El total se irá recalculando a medida que se agreguen detalles)
    const totalInicial = 0.0;
    const pedido = await Pedido.create(
      usuario_id,
      totalInicial,
      tipo_entrega,
      horario_entrega,
      direccion_envio
    );

    // Devolver únicamente el ID recién creado; los detalles se agregan después
    res
      .status(201)
      .json({ message: 'Pedido creado exitosamente', pedidoId: pedido.id });
  } catch (error) {
    console.error('[CREATE] Error al crear pedido:', error);
    res.status(500).json({ message: 'Error interno al crear el pedido' });
  }
};

// Obtener un pedido por su ID (incluye sus detalles y opciones)
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

// Actualizar datos básicos del pedido (estado, tipo_entrega, etc.)
// No modifica ni Crea detalles acá; los detalles se gestionan desde detalle.controller
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

// Eliminar un pedido (soft‐delete). Los detalles y opciones se eliminan en cascada.
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

