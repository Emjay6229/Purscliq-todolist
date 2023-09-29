require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config(
    { 
        cloud_name: process.env.cloudName, 
        api_key: process.env.cloudinaryKey, 
        api_secret: process.env.cloudinarySecret     
    }
);

module.exports = { cloudinary };
  