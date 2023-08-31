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
};

exports.checkToken = token => {
    try {
        if(!token) throw new Error("Auth token not found");

        const signedToken = jwt.verify(token, secret_key);

        if (!signedToken) throw new Error("Something went wrong with token verification");

        return signedToken;

    } catch(e) {
        console.log(e.message);
    }
};
