const db = require('../config/db');

const Opcion = {
  async findAll() {
    const [opciones] = await db.query('SELECT * FROM opciones WHERE deleted_at IS NULL');

    for (let opcion of opciones) {
      const [valores] = await db.query(
        'SELECT * FROM opciones_valores WHERE opcion_id = ? AND deleted_at IS NULL',
        [opcion.id]
      );
      opcion.valores = valores;
    }

    return opciones;
  },

  async findById(id) {
    const [opciones] = await db.query(
      'SELECT * FROM opciones WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    if (opciones.length === 0) return null;

    const opcion = opciones[0];

    const [valores] = await db.query(
      'SELECT * FROM opciones_valores WHERE opcion_id = ? AND deleted_at IS NULL',
      [id]
    );
    opcion.valores = valores;

    return opcion;
  },

  async create(nombre, tipo_valor) {
    const [result] = await db.query(
      'INSERT INTO opciones (nombre, tipo_valor, created_at, updated_at) VALUES (?, ?, NOW(), NOW())',
      [nombre, tipo_valor]
    );
    return { id: result.insertId, nombre, tipo_valor };
  },

  async update(id, nombre, tipo_valor) {
    const [result] = await db.query(
      'UPDATE opciones SET nombre = ?, tipo_valor = ?, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [nombre, tipo_valor, id]
    );
    return result.affectedRows > 0;
  },

  async softDelete(id) {
    const [result] = await db.query(
      'UPDATE opciones SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
      [id]
    );
    return result.affectedRows > 0;
  }
};

module.exports = Opcion;

