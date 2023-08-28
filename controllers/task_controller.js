const PDFDocument = require("pdfkit");
const fs = require("fs");
const Task = require("../models/Tasks");
const sendToMail = require("../middlewares/sendToMail");
const { checkToken } = require("../middlewares/token");

const domain = process.env.domain;
const key = process.env.api_key;


const createTask = async(req, res) => {
  try {
    const userPayload = checkToken(req.cookies.jwt);
    const { 
      title, 
      label, 
      // completed, 
      startDate, 
      endDate 
    } = req.body;

    const myTask = new Task({ 
      title,
      createdBy: userPayload.id,
      label
    });

    if (startDate) myTask.startDate = startDate;
    if (endDate) myTask.endDate = endDate;
    // if (completed === true) myTask.completed = completed;

    if (new Date(startDate) > new Date()) {
      myTask.status = "pending";
    }
    
    await myTask.save();  
    return res.status(200).json({ 
      message: "Task created successfully", 
      myTask 
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};


const getMyTasks = async(req, res) => {
  try {
    const userPayload = checkToken(req.cookies.jwt);

    const myTasks = await Task.find({ createdBy: userPayload.id })
      .populate("createdBy", "firstName lastName email");

   return res.status(200).json({
        myTasks
      });
    } catch(err) {
      console.log(err)
      return res.status(400).json(err.message);
  };
}


const getSingleTask = async(req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id })
      .populate("createdBy", "firstName lastName email");

    return res.status(200).json({ task });
  } catch (err) {
      console.log(err);
      return res.status(400).json(err.message);
    }
};


const getAllTasksSentAndReceived = async(req, res) => {
  try {
    const userPayload = checkToken(req.cookies.jwt);

    const myTasks = await Task.find({ 
      createdBy: userPayload.id,
      from: userPayload.email,
      to: userPayload.email 
    });

   return res.status(200).json({ 
        myTasks,
        TotalTask: myTasks.length 
      });

  } catch(err) {
    console.log(err)
    return res.status(400).json(err.message);
  }
};


const getReceivedTasks = async(req, res) => {
  try {
    const userPayload = checkToken(req.cookies.jwt);

    const myTotalReceivedTasks = await Task.find({ 
      createdBy: userPayload.id, 
      to: userPayload.email 
    });

    return res.status(200).json({ 
      myTasks, 
      TotalTask: myTotalReceivedTasks.length 
    });
  } catch(err) {
    console.log(err);
    return res.status(400).json(err.message);
  };
};


const getSentTasks = async(req, res) => {
  try {
    const userPayload = checkToken(req.cookies.jwt);

    const sentTasks = await Task.find({ 
      createdBy: userPayload.id, 
      from: userPayload.email 
    });

    return res.status(200).json({ 
      myTasks, 
      TotalTask: sentTasks.length 
    });
  } catch(err) {
    console.log(err);
    return res.status(400).json(err.message);
  };
};


const editTask = async(req, res) => {
  try {
    if( req.body.completed === true ) req.body.endDate = new Date();

    const task = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });

    return res.status(200).json({ message: 'Your task has been edited', task });

  } catch(err) {
    console.log(err)
    return res.status(400).json(err.message);
  }
}


const filterData = async (req, res) => {
    const userPayload = checkToken(req.cookies.jwt);

    if(!userPayload) return res.json("cannot complete request");

    let { 
      search,
      title,
      status,
      label, 
      date, //an oject containing start and enddate
      sortBy, 
      select, 
      limit, 
      page 
    } = req.query;

    let filterObject = { 
      createdBy: userPayload.id 
    };

    if(search) { 
      filterObject.title = { 
        $regex: search, 
        $options: "i"
      }
    };

    if(title) { 
      filterObject.title = { 
        $regex: title, 
        $options: "i"
      }
    };

    if(date) filterObject.startDate = date;
    if(status) filterObject.status = status;  

    if(label) {
      filterObject.label = { 
        $regex: label, 
        $options: "i"
      };
    };

    try {
     let taskPromise = Task.find(filterObject); // returns a promise.

       if(sortBy) {  
        sortList = sortBy.split(",").join(" ");
        taskPromise = taskPromise.sort(sortList);
      } else {
        taskPromise = taskPromise.sort('createdAt title');
      };

      if(select) {
        selectList = select.split(",").join(" ");
        taskPromise = taskPromise.select(selectList);
      };
  
      // set limit per page
      (limit) ? taskPromise = taskPromise.limit(parseInt(limit)) : taskPromise = taskPromise.limit(10);

      // paginate
      if(page) {
        skip = parseInt( (page - 1) * limit );
        taskPromise = taskPromise.skip(skip);
      } else {
        taskPromise = taskPromise.skip(0);
    };

    const tasks = await taskPromise.populate("createdBy", "firstName, lastName, email");

    return res.status(201).json({ 
      tasks, 
      numOfTasks: tasks.length 
    });
  } catch(err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};


const deleteOneTask =  async(req, res) => {
  try {
    await Task.findOneAndDelete({ _id: req.params.id });
    return res.status(200).json({ 
      message: "Success! Task has been removed" 
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};


const deleteAllTask = async(req,res) => {
  try {
    const userPayload = checkToken(req.cookies.jwt);
    await Task.deleteMany({ createdBy: userPayload.id });
    return res.status(200).json({ 
      message: "Success! all your tasks have been deleted" 
    });
  } catch(err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

const convertToPDF = async(req, res) => {
  const { taskName, completed, startDate, endDate } = req.body;
  const userPayload = checkToken(req.cookies.jwt);

  const pdfTask = new Task({
      taskName, 
      createdBy: userPayload.id, 
      startDate, 
      completed,
      endDate 
  });

  await pdfTask.save();

  const text = `Task Name: ${ pdfTask.taskName },
  Created By: ${ userPayload.email }
  Completed: ${ pdfTask.completed },
  Start date: ${ pdfTask.startDate },
  End date: ${ pdfTask.endDate }\n\n`

  try {
    const pdfDoc = new PDFDocument;
    pdfDoc.pipe(fs.createWriteStream('Tasks.pdf'));
    pdfDoc.text(text).toString();
    pdfDoc.end();

    return res.status(200).json({ success: "Your pdf file has been generated" });
  } catch (err) {
    console.log(err);
    return res.status(401).json(err.message);
  }
};

const sendTaskListToEmail = async (req, res) => {
  try {
    const { title, label, completed, startDate, endDate, to } = req.body;
    const userPayload = checkToken(req.cookies.jwt);

    const mailTask = new Task({
        title, 
        createdBy: userPayload.id, 
        label,
        startDate, 
        from: userPayload.email,
        to, 
        completed,
        endDate 
      });

    await mailTask.save();

    const text = `Task Name: ${ mailTask.title },
    Created By: ${ userPayload.email }
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
    };
    
    sendToMail(res, domain, key, messageData);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

module.exports = { 
  createTask, 
  getMyTasks,
  getAllTasksSentAndReceived,
  getReceivedTasks,
  getSentTasks,
  getSingleTask, 
  editTask, 
  deleteOneTask, 
  deleteAllTask,
  sendTaskListToEmail,
  convertToPDF,
  filterData
};