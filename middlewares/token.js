require("dotenv").config();
const jwt = require("jsonwebtoken");
const { secret_key, jwt_life } = process.env;

exports.createToken = (firstName, lastName, id, email) => {
    const payLoad = {
        firstName, 
        lastName, 
        id, 
        email 
    };

    return jwt.sign( payLoad, secret_key, { expiresIn: jwt_life } );
}

exports.checkToken = token => {
    try {
        if(!token) throw new Error("Token not present");

        const signedToken = jwt.verify(token, secret_key);

        if (!signedToken) throw new Error;

        return signedToken;

    } catch(e) {
        console.log(e.message);
    }
}
