require("dotenv").config();
const jwt = require("jsonwebtoken");
const { secret_key } = process.env;

exports.createToken = (firstName, lastName, id, email) => {
    const payLoad = {
        firstName, 
        lastName, 
        id, 
        email 
    };

    return jwt.sign( payLoad, secret_key, { expiresIn: "1d" } );
};