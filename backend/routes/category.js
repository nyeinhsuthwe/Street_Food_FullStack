const express = require('express');
const categoryController = require('../controller/categoryController');
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { body } = require('express-validator');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post('/create-category', upload.single('photo'), categoryController.createCategory);

router.post(
  '/:id/upload',
  [
    upload.single('photo'),
    body('photo').custom((value, { req }) => {
      if (!req.file) throw new Error('File is required');
      if (!req.file.mimetype.startsWith('image')) throw new Error('File must be an image');
      return true;
    }),
  ],
  categoryController.upload
);

router.get('/get-category-list', categoryController.getCategoryList);
router.delete('/delete-category/:id', categoryController.deleteCategory);
router.put('/update-category/:id',upload.single('photo'), categoryController.updateCategory)

module.exports = router

