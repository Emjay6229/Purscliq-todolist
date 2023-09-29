const router = require("express").Router();

const { 
    createTask,
    getMyTasks, 
    getSpecificTask, 
    editTask,
    deleteAllTask,  
    deleteOneTask,
    filterData,
} = require("../controllers/tasks");

const { 
    sendTaskToEmail,
    getAllTasksSentAndReceived,
    getReceivedTasks,
    getSentTasks
} = require("../controllers/get-mailed-tasks");

router.route("/")
    .post( createTask )
    .get( getMyTasks )
    .delete( deleteAllTask );

router.route("/filter").get(filterData);

router.route("/:id")
    .get( getSpecificTask )
    .patch( editTask )
    .delete( deleteOneTask );
    
router.route("/mail_list").get( getSentTasks );
router.route("/mail_list").post( sendTaskToEmail );
router.route("/total_task").get( getReceivedTasks );
router.route("/all_task").get( getAllTasksSentAndReceived );

module.exports = router;