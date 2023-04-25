const getOnlyTasksReceived = async (req, res) => {
  try {
    const decodedToken = checkToken(req.cookies.jwt);

    const myTasks = await Task.find( { to: decodedToken.email })
    res.status(200).json({ 
        myTasks,
        Task_amount: myTasks.length 
      })
  } catch(err) {
    console.log(err)
    res.status(400).json(err.message);
  }
}

const getOnlyTasksSent = async (req, res) => {
  try {
    const decodedToken = checkToken(req.cookies.jwt);

    const myTasks = await Task.find( { from: decodedToken.email })
    res.status(200).json({ 
        myTasks,
        Task_amount: myTasks.length 
      })
  } catch(err) {
    console.log(err)
    res.status(400).json(err.message);
  }
}