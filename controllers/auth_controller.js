// import modules/ dependencies
require("dotenv").config()
const User = require("../models/Users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { secret_key } = process.env 
const jwt_life = 3600 * 1000

// sign Jwt function
const createToken = (id, email) => {
    const payLoad = { id, email }
    return jwt.sign( payLoad, secret_key, { expiresIn: jwt_life })
}

// REGISTER NEW USER
const userSignup = async ( req, res ) => {
    const { firstName, lastName, email, password } = req.body;
    const securePass = await bcrypt.hash(password, bcrypt.genSaltSync(10))

    const user = new User( {
        // _id,
        firstName, 
        lastName, 
        email, 
        password: securePass
    } )

    await user.save();
    const token = createToken( user._id, user.email );
    
    res.cookie( "jwt", token, { httpOnly: true, maxAge: jwt_life } ).status(200).json({ 
            id: user._id, 
            email: user.email,
            password: user.password
        });

    console.log("Account created successfully!");
}


// USER LOGIN
const userSignin = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.login(email, password)
    const token = createToken( existingUser._id, existingUser.email );

    res.cookie("jwt", token, { 
        httpOnly: true, 
        maxAge: jwt_life
    })
        .status(200)
        .json({
            id: existingUser._id, 
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
        })

    console.log("Login successful!");
}

// UPDATE USER
const updateUser = async (req, res) => {
    const userID = { _id: req.params.id };
    const updatedUser = await User.findOneAndUpdate(userID, req.body, { new: true, runValidators: true}).select("_id email password")
    res.status(200).json( updatedUser ); 
}


// DELETE USER
const deleteUser = async (req, res) => {
    const userID = { _id: req.params.id };
    await User.findOneAndDelete(userID);
    res.status(200).json( {
        Success: "Your account is deleted"
    })
}

// USER LOGOUT
const userSignout = (req, res) => {
    res.cookie("jwt", "", { httpOnly: true, maxAge: 1 }).status(200).json ({ Success: "You have been succesfully Logged out" })
  }

module.exports = {
    userSignup, 
    userSignin,
    userSignout,
    updateUser,
    deleteUser
}
