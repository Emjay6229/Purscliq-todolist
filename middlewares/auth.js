require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const { secret_key } = process.env;
    const authHeader = req.headers.authorization
    const token = authHeader.split(" ")[1];

    if(!token) {
        res.status(500).json("Authentication failed. Please sign in");
    } else {
        jwt.verify(token, secret_key, err => { 
            if(err) throw err.message; 
        })

        next();
    };
};

module.exports = { verifyToken };