const User = require('../model/userModel')
const createToken = require('../helpers/createToken')

const authController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const UserInfo = await User.register(name, email, password);
      const token = createToken(UserInfo._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 5 * 24 * 60 * 60 * 1000,
      });

       return res.status(200).json({
        success: true,
        msg: "User created successfully",
        data: UserInfo,
        token,
      });

    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const UserInfo = await User.login(email, password);

      const token = createToken(UserInfo._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        msg: "User logged in successfully",
        data: UserInfo,
        token,
      });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
  },
};

module.exports = authController;
