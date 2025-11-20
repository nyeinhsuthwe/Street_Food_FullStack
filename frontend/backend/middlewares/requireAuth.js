const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const requireAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.jwt || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

 
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
      error: error.message,
    });
  }
};

module.exports = requireAuth;
