const path = require("path")

const signUpForm = path.join(__dirname, "../public/views/index.html")
const signInForm = path.join(__dirname, "../public/views/signIn.html")
const resetPasswordForm = path.join(__dirname, "../public/views/resetPassword.html")
const newPasswordForm = path.join(__dirname, "../public/views/newPassword.html")

exports.getSignUpForm = async (req, res) => {
    try {
        res.sendFile( signUpForm )
    } catch(err) {
        console.log("something went wrong")
        res.json(err.message)
    }
}

exports.getSignInForm = async (req, res) => {
    try {
        res.sendFile( signInForm )
    } catch(err) {
        console.log("something went wrong")
        res.json(err.message)
    }
}

exports.getResetPasswordForm = async (req, res) => {
    try {
        res.sendFile( resetPasswordForm )
    } catch(err) {
        console.log("something went wrong")
        res.json(err.message)
    }
}

exports.getNewPasswordForm = async (req, res ) => {
    try {
        res.sendFile( newPasswordForm )
    } catch(err) {
        console.log("something went wrong")
        res.json(err.message)
    }
}