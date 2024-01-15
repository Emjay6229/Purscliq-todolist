const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const team = {
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    members: { 
        type: [ Schema.Types.ObjectId ],
        ref: "Users"
    }
}

const teamSchema = Schema(team);

module.exports = model("team", teamSchema);