require("dotenv").config();
const jwt = require("jsonwebtoken");
const { secret_key } = process.env;

exports.checkToken = token => {
    if(!token) {
        throw new Error("Token not present")
    }
const signedToken = jwt.verify(token, secret_key)
    if (!signedToken) {
            throw Error
        }
    return signedToken;
}
