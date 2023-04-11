const { checkToken } = require("../middlewares/checkDecodedToken")
const Task = require("../models/Tasks")
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const { DOMAIN } = process.env
const { api_key } = process.env

// Create Task
const createTask = async (req, res) => {
  // use middleware to decode Token
  // populate the task author field with signed in user id from decoded token
    const decodedToken = checkToken(req.cookies.jwt)

    const { taskName, completed } = req.body;

    const task = new Task({ 
      // _id: ObjectId();
      author: decodedToken.id,
      taskName, 
      completed 
    } )

    await task.save();
                    
    res.status(200).json({ task })
}


// Get all Tasks
const getAllTasks = async (req, res) => {

    const decodedToken = checkToken(req.cookies.jwt)

    const tasks = await Task.find({ author: decodedToken.id })
      .populate("author", "firstName lastName email")
      // {path: "author", model: "Users" }

    res.status(200).json({ 
      tasks, 
      Task_amount: tasks.length })
  }


// Get a Single Task
const getSingleTask = async (req, res) => {

    const taskID = { _id: req.params.id }

    const task = await Task.findOne(taskID)

    res.status(200).json({ task })
  }


// Update Tasks
const updateTask =  async (req, res) => {

    const taskID = { _id: req.params.id }

    const task = await Task.findOneAndUpdate(taskID, req.body, { new: true, runValidators: true })

    res.status(200).json({ task })
}


// Delete Tasks
const deleteTask =  async (req, res) => {

    const taskID = { _id: req.params.id }

     await Task.findOneAndDelete(taskID)
    
    res.status(200)
      .json({ message: "Success! Task has been removed" })
}


const sendListToemail = async (req, res) => {
  try {
		const {email} = req.body;

    const decodedToken = checkToken(req.cookies.jwt)

    const task = await Task.find({ author: decodedToken.id })
      .select("taskName completed")

   const text = task.map(obj => {
      return `TaskName: ${obj.taskName}, Completed: ${obj.completed}\n`
    }).join("")
  
    const mailgun = new Mailgun(formData);

		const client = mailgun.client({
			username: 'api', 
			key: api_key
		});

		const messageData = {
			from: 'joshua Onwuemene <josh@mailgun.org>',
			to: email,
			subject: 'TASKS LIST',
			text: text
		};

		client.messages.create(DOMAIN, messageData)
		.then((res) => {
			console.log(res);
		})
		.catch((err) => {
			console.error(err);
		});

    res.status(200).json(res)

    } catch (err) {
        console.log(err);
    }
  }


module.exports = { 
  getAllTasks, 
  createTask, 
  getSingleTask, 
  updateTask, 
  deleteTask, 
  sendListToemail 
}