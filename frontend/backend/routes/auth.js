const express = require('express');
const authController = require('../controller/AuthController')
const {registerValidation, loginValidation} = require('../helpers/AuthValidation');
const handleErrorMessage = require('../middlewares/handleErrorMessage');
const router =  express.Router()

router.post('/login', loginValidation ,handleErrorMessage,authController.login),
router.post('/register', registerValidation,handleErrorMessage,authController.register)

module.exports = router