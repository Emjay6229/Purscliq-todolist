const domain = process.env.domain;
const key = process.env.api_key;
const Task = require("../models/Tasks");
const sendToMail = require("../middlewares/sendToMail");
const { checkToken } = require("../middlewares/token");
const Tasks = require("../models/Tasks");

const sendTaskToEmail = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const userPayload = checkToken(authHeader.split(" ")[1]);

      if(req.body) {
        const { title, category, description, status, startDate, endAt, to } = req.body;

        const mailTask = new Task({
            title, 
            createdBy: userPayload.id, 
            category,
            startDate, 
            description,
            from: userPayload.email,
            to, 
            status,
            endDate
          });
    
        await mailTask.save();
      } else if (req.body.title) {
            const mailTask = await Tasks.findOne({ 
                createdBy: userPayload.id, 
                title: req.body.title 
            }); 
        } 
        else {
            const mailTask = await Tasks.find({ createdBy: userPayload.id }); 
        };
        
        const text = `Task Name: ${ mailTask.title },
        Created By: ${ userPayload.email }
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


const getReceivedTasks = async(req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const userPayload = checkToken(authHeader.split(" ")[1]);
  
      const myTotalReceivedTasks = await Task.find({ 
        createdBy: userPayload.id, 
        to: userPayload.email 
      });
  
      return res.status(200).json({ result: myTotalReceivedTasks });
    } catch (err) {
      console.log(err);
      return res.status(400).json(err.message);
    };
  };
  
  
  const getSentTasks = async(req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const userPayload = checkToken(authHeader.split(" ")[1]);
  
      const sentTasks = await Task.find({ 
        createdBy: userPayload.id, 
        from: userPayload.email 
      });
  
      return res.status(200).json({ result: sentTasks });
    } catch(err) {
      console.log(err);
      return res.status(400).json(err.message);
    };
  };


  const getAllTasksSentAndReceived = async(req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const userPayload = checkToken(authHeader.split(" ")[1]);
  
      const allTasks = await Task.find({ 
        createdBy: userPayload.id,
        from: userPayload.email,
        to: userPayload.email 
      });
  
     return res.status(200).json({ result: allTasks });
    } catch(err) {
      console.log(err)
      return res.status(400).json(err.message);
    }
  };


  module.exports = { 
    sendTaskToEmail,
    getAllTasksSentAndReceived,
    getReceivedTasks,
    getSentTasks
  };
  
  