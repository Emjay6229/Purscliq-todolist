const router = require("express").Router()

// where "/" === "/user/tasks"

const { 
        createTask,
        getMyTasks, 
        getTotalTasksSentAndReceived,
        getTotalTasksReceived,
        getSingleTask, 
        updateTask,
        deleteAllTask,  
        deleteOneTask,
        sendListToEmail,
        convertToPDF
    } = require("../controllers/task_controller")

router.route("/")
    .post( createTask )
    .get( getMyTasks )
    .delete( deleteAllTask )
router.route("/allTask")
    .get( getTotalTasksSentAndReceived )
router.route("/received")
    .get( getTotalTasksReceived )
router.route("/:id")
    .get( getSingleTask )
    .patch( updateTask )
    .delete( deleteOneTask )
router.route("/mail")
    .post( sendListToEmail )
router.route("/createFile")
    .post( convertToPDF )

module.exports = router;