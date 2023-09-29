require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const { secret_key } = process.env;
    const token = (req.headers.authorization).split(" ")[1];

    if(!token)
        res.status(401).json("Access Denied");

    const payload = jwt.verify(token, secret_key);

    if (!payload) throw new Error("token verification error");

    req.user = payload;

    next();  
};

module.exports = { verifyToken };