require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const User = require("../models/Users");
const sendToMail = require("./utils/sendToMail");

const domain = process.env.DOMAIN;
const key = process.env.api_key;
const url = process.env.url;

exports.verifyResetEmailAndSendLink = async (req, res) => {
    try {
	    const { email } = req.body;

	    const verifiedUser = await User.findOne({ email });
	    
	    if(!verifiedUser) return res.status(400).json("User does not exist");

		const resetToken = crypto.randomBytes(32).toString("hex");

        verifiedUser.resetToken = resetToken;
        
        await verifiedUser.save();

        const token = verifiedUser.resetToken;
           
        const text = `<p>Here is the link to reset your password<p> <br>
        <a href=${url}/reset/${token}>Reset Password</a>`;

        const messageData = {
            from: 'Task Tracker <tsm@gmail.com>',
            to: email,
            subject: 'PASSWORD RESET LINK',
            html: text
        };
            
        sendToMail(res, domain, key, messageData);

        setTimeout(() => verifiedUser.resetToken = undefined, 3600000);
    } catch(err) {
        console.warn(err);
    };
};


exports.updatePassword = async (req, res) => {
	const { token } = req.params;
	const { newPassword, confirmPassword } = req.body;
	const user = await User.findOne({ resetToken: token }).select('resetToken');

	try {
		if (!token || token !== user.resetToken) throw new Error ("Valid reset token is needed");
		
		if (newPassword !== confirmPassword) throw new Error("Passwords must match");
		
		const verifyPassword = await bcrypt.compare(newPassword, user.password);

		if (verifyPassword) throw new Error("You cannot use an old password");

		const securePass = await bcrypt.hash(newPassword, bcrypt.genSaltSync(10));
		
		const updatedPassword = await User.findOneAndUpdate(
            { resetToken: token }, 
            { password: securePass }, 
            { new: true, runValidators: true }
        ).select("firstName lastName email");

		console.log("Password has been successfully reset", updatedPassword);

		return res.status(201).json("Password has been successfully reset");
	} catch(err) {
		console.log(err);
		return res.status(201).json(err.message);
	};
};