const router = require("express").Router()

// where "/" === "/user/signin/tasks"

const { 
        createTask,
        getAllTasks, 
        getSingleTask, 
        updateTask,  
        deleteTask,
        sendListToemail
    } = require("../controllers/task_controller")

router.route("/")
    .post( createTask )
    .get( getAllTasks )
   
router.route("/:id")
    .get( getSingleTask )
    .patch( updateTask )
    .delete( deleteTask )
router.route("/mailList")
    .post( sendListToemail )

module.exports = router;