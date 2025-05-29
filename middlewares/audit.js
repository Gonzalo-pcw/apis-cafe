const auditoriaService = require('../services/auditoria.service');

const audit = (accion, tabla) => {
  return async (req, res, next) => {
    res.on('finish', async () => {
      try {
        const usuario_id = req.user?.id || null;
        const registro_id = res.locals.newId || req.params.id || null;
        const detalles = req.body || {};
        const ip_address = req.ip;

        await auditoriaService.registrarLog({
          usuario_id,
          accion,
          tabla,
          registro_id,
          detalles,
          ip_address
        });
      } catch (err) {
        console.error('Error audit log:', err);
      }
    });
    next();
  };
};

module.exports = audit;
