import User from "../models/user.model.js";

export const getUsersForSideBar = async (req,res) => {
    try {
        const currentUserId = req.user._id;
        const users = await User.find({
            _id: { $ne: currentUserId }
        }).select("-password");

        res.status(200).json(users);
    } catch (error) {
        console.log('Error at getUsers functionality ' + error)
        res.status(500).json({message: "Internal Server Error"});
    }
}