const Menu = require("../model/menuModel");

const MenuController = {
  getMenu: async (req, res) => {
    try {

      const pageNo = parseInt(req.query.pageNo) || 1 ;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const categoryId = req.query.category_id || null;

      const filter = categoryId ? {category_id : categoryId} : {};
      const totalCount = await Menu.countDocuments(filter);

      const menuList = await Menu.find(filter)
      .skip((pageNo-1)*pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 });

      return res.json({
      data: menuList,
      currentPage: pageNo,
      totalPages: Math.ceil(totalCount / pageSize),
      totalItems: totalCount,
    });
      
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
   
  },

  createMenu: async (req, res) => {
    const { menu, price, description, category_id } = req.body;
    const photo = req.file ? req.file.filename : null;
    const createMenu = await Menu.create({
      menu,
      price,
      description,
      photo,
      category_id,
    });
    return res.json({
      msg: "Menu created successfully!",
      data: createMenu,
    });
  },

  updateMenu: async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = await Menu.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    return res.json({
      msg: "Menu updated successfully!",
      data: updateData,
    });
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
},


  deleteMenu: async (req, res) => {
    const { id } = req.params;
    const deleteMenu = await Menu.findByIdAndDelete(id);
    return res.json({
      msg: "Menu deleted successfully!",
    });
  },

  upload: async (req, res) => {
    try {
      const { id } = req.params;

      const menu = await Menu.findByIdAndUpdate(id, {
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

module.exports = MenuController;
