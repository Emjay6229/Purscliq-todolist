const mongoose = require("mongoose");
const { Schema } = mongoose;

function formatDateToCustomFormat() {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }

const taskSchema = new Schema(
    {
        title: { type: String, required: [ true, "Enter this field to add a task"] }, 

        createdBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },

        label: String,

        startDate: { type: String, default: formatDateToCustomFormat() },

        status: {
            type: String,
            enum: { 
                values: ['completed', 'pending', 'in progress'], 
                message: '{VALUE} is not supported' 
            },
            default: 'in progress'
        },

        // completed: { type: Boolean, default: false },

        from: { type: String, ref: "Users" },

        to: { type: String, ref: "Users" },
            
        endDate: String
    } ,

    { timestamps: true } 
)

module.exports = mongoose.model("Tasks", taskSchema);