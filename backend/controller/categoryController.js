const Category = require("../model/categoryModel");

const categoryController = {
  createCategory: async (req, res) => {
    const { name } = req.body;
    const photo = req.file ? req.file.filename : null;
    const createCategory = await Category.create({ name, photo });
    return res.json({
      message: "category created successfully!",
      data: createCategory,
    });
  },

  getCategoryList: async (req, res) => {
    const getCategoryList = await Category.find();
    return res.json({
      data: getCategoryList,
    });
  },

  deleteCategory: async (req, res) => {
    const { id } = req.params;
    const deleteCategory = await Category.findByIdAndDelete(id);
    return res.json({
      message: "Your Category is deleted Successfully!",
      data: deleteCategory,
    });
  },

  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const updateData = {};
      if (req.body.name) updateData.name = req.body.name;
      if (req.file) updateData.photo = req.file.filename;
      else if (req.body.photo) updateData.photo = req.body.photo;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No data provided to update" });
      }

      const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.json({
        message: "Category updated successfully!",
        data: updatedCategory,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Update failed", error: error.message });
    }
  },

  //for photo create
  upload: async (req, res) => {
    try {
      const { id } = req.params;

      const menu = await Category.findByIdAndUpdate(id, {
        photo: req.file.filename,
      });

      return res.status(200).json({
        success: true,
        msg: "Photo Upload Successfully",
        data: menu,
      });
    } catch (e) {
      return res.status(400).json({ msg: e.message });
    }
  },
};

module.exports = categoryController;
