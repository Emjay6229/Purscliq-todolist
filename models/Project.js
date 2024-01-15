const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const project = {
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    tasks: { 
        type: [ Schema.Types.ObjectId ],
    }
}

const projectSchema = Schema(project);

module.exports = model("Project", projectSchema);