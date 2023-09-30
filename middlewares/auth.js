require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const { secret_key } = process.env;

    if(!req.headers.authorization)
        res.status(401).json("Access Denied: Authorization header required");

    const [type, token] = (req.headers.authorization).split(" ");

    if(!(type === 'Bearer' && token))
        res.status(401).json("Access Denied: Bearer token required");

    const payload = jwt.verify(token, secret_key);

    if (!payload) 
        throw new Error("token verification error");

    req.user = payload;

    next();  
};

module.exports = { verifyToken };