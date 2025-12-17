const UserController = require("../controller/UserController")
const express = require('express');
const router = express.Router();

router.get("/get-user-list", UserController.getUserList);

module.exports = router