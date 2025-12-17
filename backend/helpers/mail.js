const nodemailer = require("nodemailer")

const sendMail = nodemailer.createTransport({
    host : ""
})