require("dotenv").config();
const jwt = require("jsonwebtoken");
const { secret_key } = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token) {
        res.status(500).json("Authentication failed. Please sign in again");
    } else {
        jwt.verify(token, secret_key, err => { 
            if (err) throw err.message; 
        })

        next();
    };
};

module.exports = { verifyToken };