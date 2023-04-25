const { checkToken } = require("../middlewares/checkDecodedToken")
const Task = require("../models/Tasks");
const User = require("../models/Users");
const sendToMail = require("../middlewares/sendToMail")
const PDFDocument = require("pdfkit");
const fs = require("fs");
const domain = process.env.DOMAIN
const key = process.env.api_key

// Create Task
const createTask = async (req, res) => {
  try {
    const decodedToken = checkToken(req.cookies.jwt);
    const { taskName, completed, startDate, endDate } = req.body;

    const task = { 
      taskName,
      createdBy: decodedToken.id
    }

    if ( startDate ) {
      myTask.startDate = startDate;
    }
    if ( completed === "true" || endDate ) {
      myTask.endDate = new Date();
    }
    
    const myTask = new Task(task);
    await myTask.save();  

    res.status(200).json({ myTask });

  } catch (err) {
    console.log(err)
    res.status(400).json(err.message);
  }
}


// Get all Users Tasks
const getMyTasks = async (req, res) => {
  try {
    const decodedToken = checkToken(req.cookies.jwt)
    const myTasks = await Task.find({ createdBy: decodedToken.id }).populate("createdBy", "firstName lastName userId email") 

    res.status(200).json({ 
        myTasks,
        Task_amount: myTasks.length 
      })
    } 
  catch(err) {
    console.log(err)
    res.status(400).json(err.message);
  }
}


// Get a Single Task
const getSingleTask = async (req, res) => {
  try {
    const taskID = { _id: req.params.id }
    const task = await Task.findOne(taskID).populate("createdBy", "firstName lastName userId email")
    res.status(200).json({ task })
  } catch (err) {
      console.log(err)
      res.status(400).json(err.message);
    }
}

// Get Total Tasks Sent and Received
const getTotalTasksSentAndReceived = async (req, res) => {
  try {
    const decodedToken = checkToken(req.cookies.jwt);

    const myTasks = await Task.find( { 
      createdBy: decodedToken.id,
      from: decodedToken.email,
      to: decodedToken.email 
    }
  )
    res.status(200).json(
      { 
        myTasks,
        Task_amount: myTasks.length 
      }
    )
  } catch(err) {
    console.log(err)
    res.status(400).json(err.message);
  }
}

// Get Total Tasks Received
const getTotalTasksReceived = async (req, res) => {
  try {
    const decodedToken = checkToken(req.cookies.jwt);

    const myTasks = await Task.find( { 
      createdBy: decodedToken.id,
     to: decodedToken.email 
    }
  )
    res.status(200).json(
      { 
        myTasks,
        Task_amount: myTasks.length 
      }
    )
  } catch(err) {
    console.log(err)
    res.status(400).json(err.message);
  }
}



// Update Tasks
const updateTask =  async (req, res) => {
  try {
    const taskID = { _id: req.params.id };

    if ( req.body.completed === true ) {
      req.body.endDate = new Date();
    }

    const task = await Task.findOneAndUpdate(taskID, req.body, { new: true, runValidators: true });
    res.status(200).json({ task });

  } catch(err) {
    console.log(err)
    res.status(400).json(err.message);
  }
}


// send List To email
const sendListToEmail = async (req, res) => {
  try {
    const { taskName, completed, startDate, endDate, to } = req.body;
    const decodedToken = checkToken(req.cookies.jwt);

    const mailTask = new Task({
        taskName, 
        // Form/postman field available, mandatory
        createdBy: decodedToken.id, 
        // no form field required, mandatory, automatically set, 
        startDate, 
        // Form/postman field available, not mandatory, automatically set to default value if absent
        from: decodedToken.email,
        // no form field required, mandatory, automatically set
        to, 
        // Form/postman field available, mandatory
        completed,
        // Check box/postman available, not mandatory, automatically set to default value if absent
        endDate 
        // Form/postman field available, not mandatory
      })

    await mailTask.save();

    const text = `Task Name: ${ mailTask.taskName },
    Created By: ${ decodedToken.email }
    From: ${ mailTask.from },
    To: ${ mailTask.to },
    Completed: ${ mailTask.completed },
    Start date: ${ mailTask.startDate },
    End date: ${ mailTask.endDate }\n\n`

    const messageData = {
      from: mailTask.from,
			to: to,
			subject: 'REQUEST FOR LIST OF TASKS',
			text: `Here is a list of your tasks\n 
      ${text}`
    }
    
    sendToMail(res, domain, key, messageData);
  } catch (err) {
    console.log(err)
    res.status(400).json(err.message);
  }
}

// Delete Tasks
const deleteOneTask =  async (req, res) => {
  try {
    const taskID = { _id: req.params.id };
    await Task.findOneAndDelete(taskID);
    res.status(200).json({ message: "Success! Task has been removed" });

  } catch(err) {
    console.log(err)
    res.status(400).json(err.message);
  }
}


const deleteAllTask = async (req,res) => {
  try {
    const decodedToken = checkToken(req.cookies.jwt)
    await Task.deleteMany( { createdBy: decodedToken.id } );
    res.status(200).json({ message: "Success! All your Tasks have been deleted" });

  } catch(err) {
    console.log(err)
    res.status(400).json(err.message);
  }
}

const convertToPDF = async (req, res) => {
  const { taskName, completed, startDate, endDate } = req.body;
    const decodedToken = checkToken(req.cookies.jwt);

    const pdfTask = new Task({
        taskName, 
        createdBy: decodedToken.id, 
        startDate, 
        completed,
        endDate 
      })

    await pdfTask.save();

    const text = `Task Name: ${ pdfTask.taskName },
    Created By: ${ decodedToken.email }
    Completed: ${ pdfTask.completed },
    Start date: ${ pdfTask.startDate },
    End date: ${ pdfTask.endDate }\n\n`

  try {

    const pdfDoc = new PDFDocument;
    pdfDoc.pipe(fs.createWriteStream('TaskList.pdf'));
    pdfDoc.text(text).toString();
    pdfDoc.end();
    res.status(200).json({ 
      success: "Your pdf file has been generated"
    })
  } catch (err) {
    res.status(401).json(err.message)
    console.log(err)
  }
}

module.exports = { 
  createTask, 
  getMyTasks,
  getTotalTasksSentAndReceived,
  getTotalTasksReceived,
  getSingleTask, 
  updateTask, 
  deleteOneTask, 
  deleteAllTask,
  sendListToEmail,
  convertToPDF
}














  // createdBy and from are set from token
  // const { taskId } = req.query;
  
  // const queryObject = { createdBy: decodedToken.id }
  // if (taskId) { 
  //   queryObject._id = taskId 
  // }
  
  // Retrieves the tasks to be sent
  // const task = await Task.find( queryObject ).select( "taskName createdBy completed startDate endDate" )
  
  //   const Othertext = task.map( obj => {
  //     return `Task Name: ${ obj.taskName },
  //     Created By: ${ obj.createdBy}
  //     From: ${ obj.from},
  //     To: ${ req.body.to},
  //     Completed: ${ obj.completed },
  //     Start date: ${ obj.startDate },
  //     End date: ${ obj.endDate }\n\n`
  //   }
  // ).join("")