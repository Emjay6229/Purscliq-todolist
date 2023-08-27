const router = require("express").Router();

const { 
        createTask,
        getMyTasks, 
        getAllTasksSentAndReceived,
        getReceivedTasks,
        getSingleTask, 
        editTask,
        deleteAllTask,  
        deleteOneTask,
        filterData,
        sendTaskListToEmail,
        convertToPDF
    } = require("../controllers/task_controller");

router.route("/")
    .post( createTask )
    .get( getMyTasks )
    .delete( deleteAllTask );

router.route("/all_task")
    .get( getAllTasksSentAndReceived );

router.route("/total_task")
    .get( getReceivedTasks );

router.route("/mail_list")
    .post( sendTaskListToEmail );

router.route("/filter").get(filterData);

router.route("/create_file")
    .post( convertToPDF );

router.route("/:id")
    .get( getSingleTask )
    .patch( editTask )
    .delete( deleteOneTask );

module.exports = router;