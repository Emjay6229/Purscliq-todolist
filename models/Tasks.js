const mongoose = require("mongoose")
const { Schema } = mongoose

const taskSchema = new Schema( {
    taskName: {
            type: String,
            required: [ true, "Enter this field to add a task"]
        }, 
    createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: true
            // parent referencing.
            // Looks inside the User model and finds the user with this _id
        },
    startDate: {
            type: String, 
            default: Date
        },
    completed: {
            type: Boolean,
            default: false
        },
    from: {
            type: String,
            ref: "Users"
        }, 
    to: {
            type: String,
            ref: "Users"
        },
    endDate: {
        type: String
    }
},

{ timestamps: true } 
)

module.exports = mongoose.model("Tasks", taskSchema);