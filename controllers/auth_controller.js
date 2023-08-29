require("dotenv").config();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const { createToken } = require("../middlewares/token");

const { jwt_life } = process.env;

const userSignup = async ( req, res ) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const checkUser = await User.findOne( { email } );

        if (checkUser) res.status(400).json( {
            message: "This user already exists"
        });

        const securePass = await bcrypt.hash(password, bcrypt.genSaltSync(10));

        const user = new User( 
            {
                firstName, 
                lastName, 
                email, 
                password: securePass
            } 
        );

        await user.save();

        const token = createToken(
            user.firstName,
            user.lastName,
            user._id,
            user.email
        );

        return res.cookie("jwt", token, { httpOnly: true }).status(200).json({
            message: "Account created successfully!", 
            user 
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};


const userSignin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.login(email, password);

        const token = createToken( 
            existingUser.firstName,
            existingUser.lastName,
            existingUser._id, 
            existingUser.email 
        );

        return res.cookie("jwt", token, { httpOnly: true, maxAge: jwt_life }).status(200).json({ 
            message: "Sign in successful", 
            user: existingUser 
        });
    } catch( err ) {
        console.log(err);
       return res.status(400).json(err.message);
    }
};

const userSignout = (req, res) => {
    try {
        res.cookie("jwt", "", { httpOnly: true, maxAge: 1 })
            .status(200).json ({ Success: "You have been successfully Logged out" });
    } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};

module.exports = { 
    userSignup, 
    userSignin, 
    userSignout 
};