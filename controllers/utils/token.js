require("dotenv").config();
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

exports.createToken = (firstName, lastName, id, email) => {
	const payLoad = {
		firstName, 
		lastName, 
		id, 
		email 
	};

  return jwt.sign( payLoad, SECRET_KEY, { expiresIn: "1d" } );
};