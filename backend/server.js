const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const menuRouter = require("./routes/menu");
const categoryRouter = require("./routes/category");
const authRouter = require("./routes/auth");
const orderRouter = require("./routes/order")
const cookieParser = require("cookie-parser");
const requireAuth = require("./middlewares/requireAuth");
const authorizeRole = require("./middlewares/authorizeRole");
const User = require("./model/userModel");
const bycrypt = require("bcrypt");
const handleErrorMessage = require("./middlewares/handleErrorMessage");

const app = express();

const mongoURL =
  "mongodb+srv://nht:nht612@nyeinhsuthwe.z7sqllh.mongodb.net/?retryWrites=true&w=majority&appName=nyeinhsuthwe";

async function createDefaultAdmin() {
  const adminEmail = "admin@gmail.com";
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const hashPassword = await bycrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashPassword,
      role: "admin",
    });
  }
}

mongoose.connect(mongoURL).then(async() => {
  await createDefaultAdmin();
  app.listen(process.env.PORT, () => {
    console.log(`app is running on ${process.env.PORT}`);
  });
  
});

app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan(`dev`));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api", authRouter);
app.use("/api/uploads", express.static("uploads"));
app.use("/api",requireAuth, menuRouter);
app.use("/api",requireAuth, categoryRouter);
app.use("/api",requireAuth, orderRouter);
