const Notificacion = require('../models/notificacion.model');

exports.listar = async (req, res) => {
  const notificaciones = await Notificacion.findAllByUser(req.user.id);
  res.json(notificaciones);
};

exports.crear = async (req, res) => {
  const { tipo, contenido } = req.body;
  if (!tipo || !contenido) return res.status(400).json({ message: 'Campos requeridos faltantes' });
  const resultado = await Notificacion.create({ usuario_id: req.user.id, tipo, contenido });
  res.status(201).json({ id: resultado.id });
};

exports.marcarLeido = async (req, res) => {
  const id = req.params.id;
  await Notificacion.marcarLeido(id, req.user.id);
  res.json({ message: 'Marcado como leído' });
};

exports.eliminar = async (req, res) => {
  const id = req.params.id;
  await Notificacion.delete(id, req.user.id);
  res.json({ message: 'Notificación eliminada' });
};
