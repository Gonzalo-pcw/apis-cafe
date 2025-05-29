const Opcion = require('../models/Opcion');
const OpcionValor = require('../models/OpcionValor');

exports.list = async (req, res) => {
  try {
    const opciones = await Opcion.findAll();
    res.json(opciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener opciones' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, tipo_valor, valores } = req.body;

    const opcion = await Opcion.create(nombre, tipo_valor);

    if (Array.isArray(valores)) {
      for (const val of valores) {
        await OpcionValor.create(opcion.id, val.valor, val.precio_extra || 0.0);
      }
    }

    const opcionCompleta = await Opcion.findById(opcion.id);
    res.status(201).json({ message: 'Opción creada', opcion: opcionCompleta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear opción' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const opcion = await Opcion.findById(id);
    if (!opcion) {
      return res.status(404).json({ message: 'Opción no encontrada' });
    }
    res.json(opcion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener opción' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo_valor, valores } = req.body;

    const existe = await Opcion.findById(id);
    if (!existe) {
      return res.status(404).json({ message: 'Opción no encontrada' });
    }

    await Opcion.update(id, nombre, tipo_valor);

    if (Array.isArray(valores)) {
      // Actualizar o crear valores
      for (const val of valores) {
        if (val.id) {
          // Si tiene id, actualizar
          await OpcionValor.update(val.id, val.valor, val.precio_extra || 0.0);
        } else {
          // Si no tiene id, crear nuevo valor
          await OpcionValor.create(id, val.valor, val.precio_extra || 0.0);
        }
      }
    }

    const opcionActualizada = await Opcion.findById(id);
    res.json({ message: 'Opción actualizada', opcion: opcionActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar opción' });
  }
};

exports.softDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const existe = await Opcion.findById(id);
    if (!existe) {
      return res.status(404).json({ message: 'Opción no encontrada' });
    }

    await Opcion.softDelete(id);

    res.json({ message: 'Opción eliminada (borrado lógico)' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar opción' });
  }
};

exports.deleteValor = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await OpcionValor.softDelete(id);

    if (!eliminado) {
      return res.status(404).json({ message: 'Valor no encontrado o ya eliminado' });
    }

    res.json({ message: 'Valor eliminado (borrado lógico)' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar valor' });
  }
};

exports.updateValor = async (req, res) => {
  try {
    const { id } = req.params;
    const { valor, precio_extra } = req.body;

    const actualizado = await OpcionValor.update(id, valor, precio_extra || 0.0);

    if (!actualizado) {
      return res.status(404).json({ message: 'Valor no encontrado o ya eliminado' });
    }

    res.json({ message: 'Valor actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar valor' });
  }
};
