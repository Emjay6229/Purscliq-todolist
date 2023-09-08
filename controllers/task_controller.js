const PDFDocument = require("pdfkit");
const fs = require("fs");
const Task = require("../models/Tasks");
const { checkToken } = require("../middlewares/token");

function compareDateAndChangeStatus(start, current, end = null) {
  if(( start > current && end >= start ) || (start > current && !end)) {
    return "pending";
  } 
  else if((start === current && end > current ) || (start === current && !end )) {
    return "in progress";
  }
  else if((start < current && end < current)) {
      return "completed";
    }

    return;
};

const createTask = async(req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const userPayload = checkToken(authHeader.split(" ")[1]);

    const { 
      title, 
      category,
      description,
      startDate,
      endDate
    } = req.body;

    const task = new Task({ 
      title,
      createdBy: userPayload.id,
      category,
      description
    });

    if(startDate) task.startDate = startDate;
    if(endDate) task.endDate = endDate;

    const currentDate = new Date();
    const startDateString = new Date(startDate);
    const endDateString = new Date(endDate);

    const taskStatus = compareDateAndChangeStatus(startDateString, currentDate, endDateString);

    if( taskStatus === "pending" || taskStatus === "in progress" || taskStatus === "completed" )
      task.status = taskStatus;

    console.log(taskStatus); 

    await task.save();  
    return res.status(200).json({ message: "Task created successfully", result: task });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};


const getMyTasks = async(req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const userPayload = checkToken(authHeader.split(" ")[1]);

    const myTasks = await Task.find({ createdBy: userPayload.id })
      .populate("createdBy", "firstName lastName email");

   return res.status(200).json({
        result: myTasks
      });
    } catch(err) {
      console.log(err)
      return res.status(500).json(err.message);
  };
}


const getSingleTask = async(req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const userPayload = checkToken(authHeader.split(" ")[1]);

    const task = await Task.findOne({ 
        createdBy: userPayload.id,
        _id: req.params.id 
      }
    ).populate("createdBy", "firstName lastName email");

    return res.status(200).json({ result: task });
  } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
    }
};


const editTask = async (req, res) => {
  const authHeader = req.headers.authorization;
  const userPayload = checkToken(authHeader.split(" ")[1]);

  console.log(req.body);

  const filterObj =  { 
    createdBy: userPayload.id, 
    _id: req.params.id 
  };

  const options = { 
    new: true, 
    runValidators: true 
  };

  const currentDate = new Date();
  let startDate;
  let endDate;
  let status;

  if(req.body.startDate) {
    startDate = new Date(req.body.startDate); 
  };

  if(req.body.endDate) {
    endDate = new Date(req.body.endDate);
  };

  if(req.body.startDate && req.body.endDate) {
    status = compareDateAndChangeStatus(startDate, currentDate, endDate);
  };

  if(status === "pending" || status === "in progress" || status === "completed") {
    req.body.status = status;
  };

  try {
      const task = await Task.findOneAndUpdate(filterObj, req.body, options);

      console.log(task);

      return res.status(200).redirect("/api/tasks");
  } catch(err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
};


const filterData = async (req, res) => {
  const authHeader = req.headers.authorization;
  const userPayload = checkToken(authHeader.split(" ")[1]);

  if(!userPayload) return res.status(500).json("cannot complete request");

    let { 
      search,
      title,
      status,
      category,
      createdAt,
      startDate,
      endDate,
      sortBy, 
      select, 
      limit, 
      page 
    } = req.query;

    let filterObject = { 
      createdBy: userPayload.id 
    };

    // search and return task by title
    if(search) { 
      filterObject.title = { 
        $regex: search, 
        $options: "i"
      }
    };

    // search item by date of creation
    if(createdAt) {
      filterObject.createdAt = createdAt
    }

    // Filter task by title
    if(title) { 
      filterObject.title = { 
        $regex: title, 
        $options: "i"
      }
    };
    
   if(startDate) {
      filterObject.startDate = startDate
    };

    if(endDate) {
      filterObject.endDate = endDate
    };

    if(status) filterObject.status = status;  

    if(category) {
      filterObject.category = { 
        $regex: category, 
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

    if (tasks.length === 0) {
      return res.status(400).json({ message: "Could not retreive any task" })
    };

    return res.status(200).json({ result: tasks });
  } catch(err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};


const deleteOneTask =  async(req, res) => {
  const authHeader = req.headers.authorization;
  const userPayload = checkToken(authHeader.split(" ")[1]);

  try {
    await Task.findOneAndDelete({ 
      createdBy: userPayload.id,
      _id: req.params.id 
    });

    return res.status(200).json({ 
      message: "Success! Task has been removed" 
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};


const deleteAllTask = async(req,res) => {
  const authHeader = req.headers.authorization;
  const userPayload = checkToken(authHeader.split(" ")[1]);

  try {
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
  const { title, category, description, startDate, endDate } = req.body;

  const authHeader = req.headers.authorization;
  const userPayload = checkToken(authHeader.split(" ")[1]);

  const pdfTask = new Task({
      title, 
      createdBy: userPayload.id,
      category,
      description,
      startDate,
      endDate
  });

  await pdfTask.save();

  const text = `Task Name: ${ pdfTask.taskName },
  Created By: ${ userPayload.email },
  Description: ${ pdfTask.description }
  Status: ${ pdfTask.status },
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


module.exports = { 
  createTask, 
  getMyTasks,
  getSingleTask, 
  editTask, 
  deleteOneTask, 
  deleteAllTask,
  convertToPDF,
  filterData
};
