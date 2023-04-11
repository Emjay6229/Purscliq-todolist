require("dotenv").config();
const User = require("../models/Users")
const crypto = require("crypto")
const { resetPasswordLink }= require("./resetPassword");

// FORGOT PASSWORD
exports.verifyResetEmailAndSendLink = async (req, res) => {
    const resetToken = crypto.randomBytes(32).toString("hex");

    const { email } = req.body;
    const verifiedUser = await User.findOne( { email } )
    
    if( !verifiedUser ) {
        console.log("User does not exist");
        res.redirect("../public/views/resetPassword.html")
    }

    verifiedUser.resetToken = resetToken;
    verifiedUser.resetTokenExpiration = Date.now() + 3600000; 
    // current time in miliseconds + 1 hour in miliseconds
    
    await verifiedUser.save();
    // console.log(verifiedUser)

    resetPasswordLink(req, res);
}
