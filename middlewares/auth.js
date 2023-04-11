require("dotenv").config();
const jwt = require("jsonwebtoken");
const { secret_key } = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;

    if(!token) {
        throw new Error("Authentication Failed. Please sign in again")
    } else {
        jwt.verify(token, secret_key, (err, decodedToken) => {
            if (err) {
                throw Error (err);
            } 
        })

        next();
    }
}

module.exports = { verifyToken };