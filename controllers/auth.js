require("dotenv").config();
const User = require("../models/Users");
const bcrypt = require("bcrypt");
const { createToken } = require("./utils/token");

exports.signup = async ( req, res ) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const checkUserEmail = await User.findOne({ email }).select("email");
   
        if (checkUserEmail) throw new Error("This user already exists");

        const securePass = await bcrypt.hash(password, bcrypt.genSaltSync(10));

        const user = new User({
                firstName, 
                lastName, 
                email, 
                password: securePass
            });

        await user.save();
        return res.status(200).json("Account created successfully!");
    } catch (err) {
        console.log(err);
        return res.status(500).json(err.message);
    }
};


exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.login(email, password);

        const token = createToken( 
            user.firstName,
            user.lastName,
            user._id, 
            user.email 
        );

        const userData =  {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
         }

        return res.status(200).json({ 
            message: "Sign in successful", 
            token,
            user: userData
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json(err.message);
    }
};