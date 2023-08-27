const router = require('express').Router();

const { verifyToken } = require("../middlewares/auth");
const { getMyProfile, deleteMyProfile, updateMyProfile } = require("../controllers/profile_controller");


router.route("/")
  .get( verifyToken, getMyProfile )
  .patch( verifyToken, updateMyProfile )
  .delete( verifyToken, deleteMyProfile )

  module.exports = router;