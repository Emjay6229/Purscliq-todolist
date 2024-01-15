require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	const { SECRET_KEY } = process.env;

	if(!req.headers.authorization)
		res.status(401).json("Access Denied: Authorization header required");

	const [type, token] = (req.headers.authorization).split(" ");

	if(!(type === 'Bearer' && token))
		res.status(401).json("Access Denied: Bearer token required");

	const payload = jwt.verify(token, SECRET_KEY);

	if (!payload) 
		throw new Error("token verification error");

  req.user = payload;

  next();  
};

module.exports = { verifyToken };