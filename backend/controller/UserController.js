const User = require("../model/userModel")

const UserController = {
    getUserList: async (req, res) => {
        const userList = await User.find();
        return res.json({
            data : userList
        })
    }
}

module.exports = UserController