const Task = require("../models/Tasks");
const { compareDateAndChangeStatus } = require("./utils/dateUtil");
const { formatDateToCustomFormat } = require("./utils/dateUtil");

const createTask = async (req, res) => {
  try {
    let { 
      title, 
      category,
      description,
      startDate,
      endDate
    } = req.body;

    const task = new Task({ 
      title,
      createdBy: req.user.id,
      category,
      description
    });

    // Check for dates, compare them and set task status accordingly
    if(endDate) task.endDate = endDate;

    let taskStatus;

    if(startDate) {
      task.startDate = startDate;
      taskStatus = compareDateAndChangeStatus(startDate, endDate);
    };

    if(taskStatus === "pending" || taskStatus === "in progress" || taskStatus === "completed") {
      task.status = taskStatus;
    };

    await task.save();  
    return res.status(200).json({ message: "Task created successfully", result: task });
  } catch (err) {
    console.error(err);
    return res.status(500).json(err.message);
  }
};


const getMyTasks = async(req, res) => {
  try {
    const myTasks = await Task.find({ createdBy: req.user.id })
      .populate("createdBy", "-_id firstName lastName")
      .sort("createdAt startDate title category");

   return res.status(200).json({
        result: myTasks
      });
    } catch(err) {
      console.log(err)
      return res.status(500).json(err.message);
  };
};


const getSpecificTask = async(req, res) => {
  try {
    const task = await Task.findOne({ 
        createdBy: req.user.id,
        _id: req.params.id 
      }
    ).populate("createdBy", " -_id firstName lastName");

    return res.status(200).json({ result: task });
  } catch (err) {
      console.log(err);
      return res.status(500).json(err.message);
    }
};


const editTask = async (req, res) => {
  const updatedTask = req.body;

  const filterObj =  { 
    createdBy: req.user.id, 
    _id: req.params.id 
  };

  const options = { 
    new: true, 
    runValidators: true 
  };

  if(!updatedTask) {
    return res.status(400).json("Updated task data is missing in the request body.");
  };

  // Runs when user marks completed else just updates the required field
  if(updatedTask.status && updatedTask.status === "completed") {
     updatedTask.endDate = formatDateToCustomFormat();
  } else {
      let taskStatus;

      if(updatedTask.startDate) {
          taskStatus = compareDateAndChangeStatus(updatedTask.startDate, updatedTask.endDate);
        };
  
      if(taskStatus === "pending" || taskStatus === "in progress") {
        updatedTask.status = taskStatus;
      } else if(taskStatus === "completed") {
        updatedTask.status = taskStatus;
        updatedTask.endDate = formatDateToCustomFormat();
      }; 
    };

  // updates data in database 
  try {
    const task = await Task.findOneAndUpdate(filterObj, updatedTask, options);
    return res.status(200).json({ result: task });
  } catch(err) {
    console.log(err);
    return res.status(500).json(err.message);
  }
};

const searchTaskByNamAndDescription = async(req, res) => {
  const { search, page, limit } = req.query;
 
  try {
    let searchQuery = Task.find({ 
      $text: { $search: search }
    })

   limit ? searchQuery = searchQuery.limit( parseInt(limit) ) : searchQuery = searchQuery.limit(10);

   if(page) {
    const pageLimit = limit ? parseInt(limit) : 10;
    const skip = ( page - 1 ) * pageLimit;
    searchQuery = searchQuery.skip(skip);
  } else {
    searchQuery = searchQuery.skip(0);
   }

   let result = await searchQuery.exec();

   return res.status(200).json(result);
  } catch(err) {
    throw err;
  }
}


const deleteOneTask =  async(req, res) => {
  try {
    await Task.findOneAndDelete({ 
      createdBy: req.user.id,
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
  try {
    await Task.deleteMany({ createdBy: req.user.id});
    return res.status(200).json({ 
      message: "Success! all your tasks have been deleted" 
    });
  } catch(err) {
    console.log(err);
    return res.status(400).json(err.message);
  }
};

module.exports = { 
  createTask, 
  getMyTasks,
  getSpecificTask, 
  editTask, 
  deleteOneTask, 
  deleteAllTask,
  searchTaskByNamAndDescription
};
