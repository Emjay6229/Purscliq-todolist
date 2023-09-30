require("dotenv").config();
const User = require("../models/Users");
const { createToken } = require("./utils/token");
const { cloudinary } = require("./utils/cloudinary");
         
const getMyProfile = async (req, res) => {
    try {
        const myProfile = await User.findOne({ _id: req.user.id })
            .select("firstName lastName email");

        return res.status(200).json( myProfile );
    } catch(err) {
        console.log(err) 
        return res.status(400).json(err.message);
    }
}


const updateMyProfile = async (req, res) => {
    try {
        const updatedProfile = await User.findOneAndUpdate({ _id: req.user.id }, req.body, 
            { 
                new: true, 
                runValidators: true
            }
        ).select("firstName lastName email");

    const token = createToken(
            updatedProfile.firstName, 
            updatedProfile.lastName, 
            updatedProfile._id, 
            updatedProfile.email
        );

    res.status(200).json({ message: "Success", token });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}

const uploadProfilePhoto = async(req, res) => {
    const options = { 
        new: true, 
        runValidators: true
    }

    const [type, ext] = req.file.mimetype.split("/");

    if (type !== "image" && ext !== "jpeg") {
        return res.status(401).json("Wrong filetype. Image files only")
    }
        
    try {
        const imagePath = req.file.path;
        const uploadRes = await cloudinary.uploader.upload(imagePath, {
            upload_preset: "dev_preset"
        });

        const userProfile = await User.findOneAndUpdate( 
            { _id: req.user.id }, 
            { profilePhoto: uploadRes.secure_url }, 
            options 
        )

        await userProfile.save();
        return res.status(201).json(uploadRes.secure_url);
    } catch (err) {
        console.error(err);
        res.json(err.message)
    }
}


const deleteMyProfile = async (req, res) => {
    try {
        await User.findOneAndDelete({_id: req.user.id});
        return res.status(200).json({ Success: "Your account is deleted" });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
}

module.exports = {
    getMyProfile,
    updateMyProfile,
    deleteMyProfile,
    uploadProfilePhoto
};
