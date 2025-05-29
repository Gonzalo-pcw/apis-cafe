const auditoriaService = require('../services/auditoria.service');

const listarLogs = async (req, res) => {
  try {
    const logs = await auditoriaService.obtenerTodos();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener logs', error });
  }
};

module.exports = {
  listarLogs
};
