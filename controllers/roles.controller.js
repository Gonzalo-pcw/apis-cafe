// controllers/roles.controller.js
const db = require('../config/db');

const RolesController = {
  // GET /api/roles
  async listar(req, res) {
    const [roles] = await db.query(
      'SELECT id, name FROM roles WHERE deleted_at IS NULL'
    );
    return res.json(roles);
  },

  // POST /api/roles
  async crear(req, res) {
    // Solo admin
    if (req.user.rol_id !== 3) {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ mensaje: 'Falta nombre de rol' });
    }

    const [result] = await db.query(
      'INSERT INTO roles (name) VALUES (?)',
      [name]
    );

    return res.status(201).json({
      mensaje: 'Rol creado',
      rol: { id: result.insertId, name }
    });
  },

  // PUT /api/roles/:id
  async actualizar(req, res) {
    // Solo admin
    if (req.user.rol_id !== 3) {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ mensaje: 'Falta nombre de rol' });
    }

    const [result] = await db.query(
      'UPDATE roles SET name = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [name, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }

    return res.json({ mensaje: 'Rol actualizado' });
  },

  // DELETE /api/roles/:id
  async eliminar(req, res) {
    // Solo admin
    if (req.user.rol_id !== 3) {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    const { id } = req.params;
    const [result] = await db.query(
      'UPDATE roles SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Rol no encontrado' });
    }

    return res.json({ mensaje: 'Rol eliminado' });
  }
};

module.exports = RolesController;
