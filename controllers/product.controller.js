const productService = require('../services/product.service');

exports.create = async (req, res) => {
  try {
    const id = await productService.createProduct(req.body);
    res.status(201).json({ id });
  } catch {
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

exports.list = async (req, res) => {
  const products = await productService.listProducts();
  res.json(products);
};

exports.getById = async (req, res) => {
  const prod = await productService.getProductById(req.params.id);
  if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(prod);
};

exports.update = async (req, res) => {
  await productService.updateProduct(req.params.id, req.body);
  res.json({ message: 'Producto actualizado' });
};

exports.remove = async (req, res) => {
  await productService.removeProduct(req.params.id);
  res.json({ message: 'Producto eliminado' });
};
