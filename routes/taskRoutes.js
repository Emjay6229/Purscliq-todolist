const router = require("express").Router();

const { 
    createTask,
    getMyTasks, 
    getSpecificTask, 
    editTask,
    deleteAllTask,  
    deleteOneTask,
    filterData,
    convertToPDF
} = require("../controllers/task_controller");

const { 
    sendTaskToEmail,
    getAllTasksSentAndReceived,
    getReceivedTasks,
    getSentTasks
} = require("../controllers/get_mailed_tasks");

router.route("/")
    .post( createTask )
    .get( getMyTasks )
    .delete( deleteAllTask );

router.route("/filter").get(filterData);
router.route("/create_file").post( convertToPDF );

router.route("/:id")
    .get( getSpecificTask )
    .patch( editTask )
    .delete( deleteOneTask );
    
router.route("/mail_list").get( getSentTasks );
router.route("/mail_list").post( sendTaskToEmail );
router.route("/total_task").get( getReceivedTasks );
router.route("/all_task").get( getAllTasksSentAndReceived );

module.exports = router;