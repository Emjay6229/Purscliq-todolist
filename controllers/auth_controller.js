// import modules/ dependencies
require("dotenv").config()
const User = require("../models/Users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { secret_key } = process.env 
const { checkToken } = require("../middlewares/checkDecodedToken")
const jwt_life = 1800 * 1000

const createToken = (firstName, lastName, id, userId, email) => {
    const payLoad = {
        firstName, 
        lastName, 
        id, 
        userId, 
        email 
    }
    return jwt.sign( payLoad, secret_key, { expiresIn: jwt_life })
}

// REGISTER NEW USER
const userSignup = async ( req, res ) => {
    try {
        const { firstName, lastName, userId, email, password } = req.body;
        const checkUser = await User.findOne( { email } )

        if ( checkUser !== null )  {
            throw new Error("This user already exists")
        }

        const securePass = await bcrypt.hash(password, bcrypt.genSaltSync(10));
        const user = new User( 
            {
                // _id,
                firstName, 
                lastName,
                userId, 
                email, 
                password: securePass
            } 
        )

        await user.save();
        const token = createToken(
            user.firstName,
            user.lastName,
            user._id, 
            user.userId, 
            user.email
        );

        res.cookie("jwt", token, { 
                httpOnly: true, 
                maxAge: jwt_life
            }
        ).status(200).json(
            { 
                id: user._id, 
                firstName: user.firstName,
                lastName: user.lastName,
                userId: user.userId,
                email: user.email,
            }
        );

        console.log("Account created successfully!");
    } catch (err) {
        res.status(400).json(err.message)
        console.log(err)
    }
}


// USER LOGIN
const userSignin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.login(email, password)
        const token = createToken( 
            existingUser.firstName,
            existingUser.lastName,
            existingUser._id, 
            existingUser.userId, 
            existingUser.email 
        );

        res.cookie("jwt", token, { 
                httpOnly: true, 
                maxAge: jwt_life
            }
        ).status(200).json(
            {
                id: existingUser._id, 
                userId: existingUser.userId,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email
            }
        )

        console.log("Login successful!");
    } catch ( err ) {
        res.status(400).json(err.message)
        console.log(err) 
    }
}

// GET SINGLE PROFILE
const getMyProfile = async (req, res) => {
    try {
        const decodedToken = checkToken(req.cookies.jwt)
        const tokenId = decodedToken.userId;
        const userId = { userId: req.params.userId };

        if ( userId.userId !== tokenId ) {
            throw new Error("Unauthorized Request")
        }

        const myProfile = await User.findOne(userId).select("firstName lastName userId email");
        res.status(200).json( myProfile );
    } catch(err) {
        res.status(400).json(err.message)
        console.log(err) 
    }
}

// UPDATE/EDIT USER PROFILE
const updateMyProfile = async (req, res) => {
    try {
        const decodedToken = checkToken(req.cookies.jwt)
        const tokenId = decodedToken.userId;
        const userId = { userId: req.params.userId };
        
        if ( userId.userId !== tokenId ) {
            throw new Error("Unauthorized Request")
        }

        const updatedProfile = await User.findOneAndUpdate( userId, req.body, { 
            new: true, 
            runValidators: true
        } 
    ).select("firstName lastName email userId")

    console.log(updatedProfile);

    const token = createToken(
        updatedProfile.firstName,
        updatedProfile.lastName,
        updatedProfile._id, 
        updatedProfile.userId, 
        updatedProfile.email 
    );

    res.cookie("jwt", token, { 
            httpOnly: true, 
            maxAge: jwt_life
        }
    ).status(200).json(
            {
                id: updatedProfile._id, 
                userId: updatedProfile.userId,
                email: updatedProfile.email
            }
        ) 
    } catch (err) {
        res.status(400).json(err.message)
        console.log(err) 
    }
}


// DELETE USER/ACCOUNT
const deleteMyProfile = async (req, res) => {
    try {
        const decodedToken = checkToken(req.cookies.jwt)
        const tokenId = decodedToken.userId;
        const userId = { userId: req.params.userId };
           
        if ( userId.userId !== tokenId ) {
            throw new Error("Unauthorized Request")
        }

        await User.findOneAndDelete(userId);
        res.status(200).json( {
            Success: "Your account is deleted"
        })
    } catch (err) {
        res.status(400).json(err.message)
        console.log(err)
    }
}

// USER LOGOUT
const userSignout = (req, res) => {
    try {
        res.cookie("jwt", "", { httpOnly: true, maxAge: 1 })
            .status(200).json ({ Success: "You have been succesfully Logged out" })
    } catch (err) {
        res.status(400).json(err.message)
        console.log(err)
    }
}

module.exports = {
    userSignup, 
    userSignin,
    userSignout,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile
}
