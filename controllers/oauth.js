require("dotenv").config();
const jwtStrategy = require('passport-jwt').Strategy;
const getJwt = require("passport-jwt").ExtractJwt;
const User = require("../models/Users");

const options = {
    jwt: getJwt.fromAuthHeaderAsBearerToken(),
    secretKey: process.env.secretKey
};

const passport = passport.use( new jwtStrategy(options, (payload, done) => {

}))