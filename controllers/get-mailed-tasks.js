const Task = require("../models/Tasks");
const sendToMail = require("./utils/sendToMail");

const domain = process.env.domain;
const key = process.env.api_key;

exports.sendTaskToEmail = async (req, res) => {
    try {
      if(req.body) {
        const { title, category, description, status, startDate, endAt, to } = req.body;

        const mailTask = new Task({
            title, 
            createdBy: req.user.id, 
            category,
            startDate, 
            description,
            from: req.user.email,
            to, 
            status,
            endAt
          });
    
        await mailTask.save();
      } else if (req.body.title) {
            const mailTask = await Tasks.findOne({ 
                createdBy: req.user.id, 
                title: req.body.title 
            }); 
        } 
        else {
            const mailTask = await Tasks.find({ createdBy: req.user.id }); 
        };
        
        const text = `Task Name: ${ mailTask.title },
        Created By: ${ req.user.email }
        From: ${ mailTask.from },
        To: ${ mailTask.to },
        Status: ${ mailTask.status },
        Start date: ${ mailTask.startDate },
        End date: ${ mailTask.endDate}\n\n`
    
        const messageData = {
          from: mailTask.from,
          to: to,
          subject: 'LIST OF TASKS',
          text: `Here is a list of your tasks\n\n${text}`
        };
        
        sendToMail(res, domain, key, messageData);


      } catch (err) {
        console.log(err);
        return res.status(400).json(err.message);
    }
};


exports.getReceivedTasks = async(req, res) => {
    try {
      const myTotalReceivedTasks = await Task.find({ 
        createdBy: req.user.id, 
        to: req.user.email 
      });
  
      return res.status(200).json({ result: myTotalReceivedTasks });
    } catch (err) {
      console.log(err);
      return res.status(400).json(err.message);
    };
  };
  
  
exports.getSentTasks = async(req, res) => {
    try {
      const sentTasks = await Task.find({ 
        createdBy: req.user.id, 
        from: req.user.email 
      });
  
      return res.status(200).json({ result: sentTasks });
    } catch(err) {
      console.log(err);
      return res.status(400).json(err.message);
    };
  };


exports.getAllTasksSentAndReceived = async(req, res) => {
    try {
      const allTasks = await Task.find({ 
        createdBy: req.user.id,
        from: req.user.email,
        to: req.user.email 
      });
  
     return res.status(200).json({ result: allTasks });
    } catch(err) {
      console.log(err)
      return res.status(400).json(err.message);
    }
};