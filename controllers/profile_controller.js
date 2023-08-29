require("dotenv").config();
const { checkToken } = require("../middlewares/token");
const User = require("../models/Users");
const { createToken } = require("../middlewares/token");
const {jwt_life} = process.env.jwt_life

const getMyProfile = async (req, res) => {
    try {
        const userPayload = checkToken(req.cookies.jwt);

        const myProfile = await User.findOne({ _id: userPayload.id })
            .select("firstName lastName email");

        return res.status(200).json( myProfile );
    } catch(err) {
        console.log(err) 
        return res.status(400).json(err.message);
    }
}


const updateMyProfile = async (req, res) => {
    const userPayload = checkToken(req.cookies.jwt);

    try {
        const updatedProfile = await User.findOneAndUpdate({ _id: userPayload.id }, req.body, 
            { 
                new: true, 
                runValidators: true
            }
        ).select("firstName lastName email");

    const token = createToken(updatedProfile.firstName, updatedProfile.lastName, updatedProfile._id, updatedProfile.email);

    res.cookie("jwt", token, { httpOnly: true, maxAge: jwt_life }).status(200).json(
            {
                id: updatedProfile._id,
                email: updatedProfile.email
            }
        );
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}


const deleteMyProfile = async (req, res) => {
    try {
        const userPayload = checkToken(req.cookies.jwt);

        await User.findOneAndDelete({_id: userPayload.id});
        return res.status(200).json({ Success: "Your account is deleted" });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}


module.exports = {
    getMyProfile,
    updateMyProfile,
    deleteMyProfile
};
