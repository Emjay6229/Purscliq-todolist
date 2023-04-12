const mongoose = require("mongoose")
const { Schema } = mongoose

const taskSchema = new Schema( {
    taskName: {
        type: String,
        required: [ true, "Enter this field to add a task"]
    }, 
    author: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required: true
        // parent referencing.
        // Looks inside the User model and finds the user with this _id
    },
    completed: {
        type: Boolean,
        default: false,
    }
},

{ timestamps: true } 
)

module.exports = mongoose.model("Tasks", taskSchema);