const db = require('../config/db');

const ResenaController = {
  async crear(req, res) {
    const { producto_id, calificacion, comentario } = req.body;
    const usuario_id = req.user.id;

    await db.query(
      `INSERT INTO resenas (usuario_id, producto_id, calificacion, comentario)
       VALUES (?, ?, ?, ?)`,
      [usuario_id, producto_id, calificacion, comentario]
    );

    res.status(201).json({ mensaje: 'Reseña guardada' });
  },

  async listarPorProducto(req, res) {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT r.*, u.nombre AS usuario
       FROM resenas r
       JOIN usuarios u ON r.usuario_id = u.id
       WHERE r.producto_id = ? AND r.deleted_at IS NULL`,
      [id]
    );
    res.json(rows);
  },

  async listarPorUsuario(req, res) {
    const { id } = req.params;
    if (req.user.id !== parseInt(id)) return res.sendStatus(403);

    const [rows] = await db.query(
      `SELECT r.*, p.nombre AS producto
       FROM resenas r
       JOIN productos p ON r.producto_id = p.id
       WHERE r.usuario_id = ? AND r.deleted_at IS NULL`,
      [id]
    );
    res.json(rows);
  },

  async editar(req, res) {
    const { id } = req.params;
    const { calificacion, comentario } = req.body;

    const [check] = await db.query(`SELECT * FROM resenas WHERE id = ?`, [id]);
    if (!check.length || check[0].usuario_id !== req.user.id) return res.sendStatus(403);

    await db.query(
      `UPDATE resenas SET calificacion = ?, comentario = ?, updated_at = NOW() WHERE id = ?`,
      [calificacion, comentario, id]
    );
    res.json({ mensaje: 'Reseña actualizada' });
  },

  async eliminar(req, res) {
    const { id } = req.params;

    const [check] = await db.query(`SELECT * FROM resenas WHERE id = ?`, [id]);
    if (!check.length || (check[0].usuario_id !== req.user.id && !req.user.admin)) return res.sendStatus(403);

    await db.query(`UPDATE resenas SET deleted_at = NOW() WHERE id = ?`, [id]);
    res.json({ mensaje: 'Reseña eliminada' });
  }
};

module.exports = ResenaController;

