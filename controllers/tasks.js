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

const filterData = async (req, res) => {
  if(!req.user) return res.status(500).json("cannot complete request");

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
      createdBy: req.user.id
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
      filterObject.createdAt = createdAt;
    }

    // filter task by title
    if(title) { 
      filterObject.title = { 
        $regex: title, 
        $options: "i"
      };
    };

    // filter by start and/or end dates
   if(startDate) filterObject.startDate = startDate;
   if(endDate) filterObject.endDate = endDate;

   // filter by category and status
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
  filterData
};
