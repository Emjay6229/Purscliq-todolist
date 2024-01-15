const mongoose = require("mongoose");
const { Schema } = mongoose;
const { formatDateToCustomFormat } = require("../controllers/utils/dateUtil");

const tasks = {
	title: { 
		type: String, 
		required: [ true, "Enter this field to add a task"] 
	}, 

	createdBy: { 
		type: Schema.Types.ObjectId, 
		ref: "Users", 
		required: true 
	},

	category: { 
		type: String, 
		required: true 
	},

	description: String,

	startDate: { 
		type: String, 
		default: formatDateToCustomFormat() 
	},

	endDate: String,

	status: {
		type: String,
		enum: { values: ['completed', 'pending', 'in progress'], message: '{VALUE} is not supported' },
		default: 'in progress'
	},

	from: { 
		type: String, 
		ref: "Users" 
	},

	to: { 
		type: String, 
		ref: "Users" 
	},

	createdAt: { 
		type: String, 
		default: formatDateToCustomFormat() 
	}
}

const taskSchema = new Schema(tasks);

taskSchema.index({ 
	title: "text", 
	description: "text" 
});

module.exports = mongoose.model("Tasks", taskSchema);