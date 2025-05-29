const pool = require('../config/db');

async function createCategory(name) {
  const [result] = await pool.query(
    'INSERT INTO categorias (nombre) VALUES (?)',
    [name]
  );
  return result.insertId;
}

async function listCategories() {
  const [rows] = await pool.query('SELECT * FROM categorias WHERE deleted_at IS NULL');
  return rows;
}

async function getCategoryById(id) {
  const [rows] = await pool.query(
    'SELECT * FROM categorias WHERE id = ? AND deleted_at IS NULL',
    [id]
  );
  return rows[0];
}

async function updateCategory(id, name) {
  await pool.query(
    'UPDATE categorias SET nombre = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, id]
  );
}

async function removeCategory(id) {
  // Soft delete
  await pool.query(
    'UPDATE categorias SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
}

module.exports = {
  createCategory,
  listCategories,
  getCategoryById,
  updateCategory,
  removeCategory
};
