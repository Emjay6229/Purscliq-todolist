const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const { isEmail }= require("validator");

const userSchema = Schema( {
    firstName: {
        type: String,
        trim: true,
        required: [ true, "This field is required"]
    }, 

    lastName: {
        type: String,
        trim: true,
        required: [ true, "This field is required"]
    },

    email: {
        type: String,
        required:  [true, "This field is required"],
        unique: true,
        trim: true,
        validate: [isEmail, "invalid Email address"],
        lowerCase: true,
    },

    password: {
        type: String,
        trim: true,
        required: [ true, "This field is required"],
        minlength: [6, "minimum password length is 6 characters"]
    },
    
    resetToken: String,
    resetTokenExpiration: Date,
  } 
)

// create login method
  userSchema.statics.login = async function( email, password) {
    const user = await this.findOne({ email });

    if(!user)
      throw new Error("User not found.");

    if(!password)
      throw new Error("Password is required.");
    
    const isPasswordMatch = await bcrypt.compare( password, user.password );

    if(!isPasswordMatch) 
      throw new Error("You have entered an incorrect password");

    return user;
  }

  module.exports = mongoose.model("Users", userSchema);