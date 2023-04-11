const mongoose = require("mongoose")
const { Schema } = mongoose

const taskSchema = new Schema( {
    author: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
        // parent referencing.
        // Looks inside the User model and finds the user with this _id
    },
    taskName: {
        type: String,
        required: [ true, "Enter this field to add a task"]
    }, 
    completed: {
        type: Boolean,
        default: false,
    },
},

{ timestamps: true } 
)

module.exports = mongoose.model("Tasks", taskSchema);