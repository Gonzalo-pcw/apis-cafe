const categoryService = require('../services/category.service');

exports.create = async (req, res) => {
  try {
    const id = await categoryService.createCategory(req.body.nombre);
    res.status(201).json({ id });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear categoría' });
  }
};

exports.list = async (req, res) => {
  const cats = await categoryService.listCategories();
  res.json(cats);
};

exports.getById = async (req, res) => {
  const cat = await categoryService.getCategoryById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Categoría no encontrada' });
  res.json(cat);
};

exports.update = async (req, res) => {
  await categoryService.updateCategory(req.params.id, req.body.nombre);
  res.json({ message: 'Categoría actualizada' });
};

exports.remove = async (req, res) => {
  await categoryService.removeCategory(req.params.id);
  res.json({ message: 'Categoría eliminada' });
};
