const UserController = require("../controller/UserController")
const express = require('express');
const router = express.Router();

router.get("/get-user-list", UserController.getUserList);
router.put("/update-role/:id", UserController.updateUserRole);
router.delete("/delete-user/:id", UserController.deleteUser)

module.exports = router