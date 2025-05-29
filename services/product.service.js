const pool = require('../config/db');

async function createProduct(data) {
  const { categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, stock } = data;
  const [result] = await pool.query(
    `INSERT INTO productos
      (categoria_id,nombre,descripcion,precio,imagen_url,disponible,destacado,stock)
     VALUES (?,?,?,?,?,?,?,?)`,
    [categoria_id, nombre, descripcion, precio, imagen_url, disponible, destacado, stock]
  );
  return result.insertId;
}

async function listProducts() {
  const [rows] = await pool.query(
    `SELECT p.*, c.nombre AS categoria
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.id
      WHERE p.deleted_at IS NULL`
  );
  return rows;
}

async function getProductById(id) {
  const [rows] = await pool.query(
    `SELECT p.*, c.nombre AS categoria
       FROM productos p
       JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = ? AND p.deleted_at IS NULL`,
    [id]
  );
  return rows[0];
}

async function updateProduct(id, data) {
  const fields = ['categoria_id','nombre','descripcion','precio','imagen_url','disponible','destacado','stock'];
  const vals   = fields.map(f => data[f]);
  vals.push(id);
  await pool.query(
    `UPDATE productos
        SET ${fields.map(f=>`${f}=?`).join(',')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
    vals
  );
}

async function removeProduct(id) {
  await pool.query(
    'UPDATE productos SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
    [id]
  );
}

module.exports = {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  removeProduct
};
