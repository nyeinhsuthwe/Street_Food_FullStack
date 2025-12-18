const User = require("../model/userModel")

const UserController = {
    getUserList: async (req, res) => {
        const pageNo = parseInt(req.query.pageNo) || 1
        const pageSize = parseInt(req.query.pageSize) || 10
        const totalCount = await User.countDocuments()
        const userList = await User.find()
            .skip((pageNo - 1) * pageSize)
            .limit(pageSize)
            .sort({ createdAt: -1 });;;
        return res.json({
            data: userList,
            currentPage: pageNo,
            totalPages: Math.ceil(totalCount / pageSize),
            totalItems: totalCount,
        })
    },

    updateUserRole: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedRole = await User.findByIdAndUpdate(id,
                { ...req.body },
                { new: true, runValidators: true }
            )

            return res.json({
                message: "Role updated successfully",
                data: updatedRole
            })

        } catch (error) {
            return res.status(400).json({ message: error.message })
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { id } = req.params
            const deletedUser = await User.findByIdAndDelete(id)

            return res.json({
                message: "User deleted successully!"
            })

        } catch (error) {
            return res.status(400).json({
                message: error.message
            })
        }
    }

}

module.exports = UserController