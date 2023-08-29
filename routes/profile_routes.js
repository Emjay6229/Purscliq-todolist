const router = require('express').Router();

const { getMyProfile, deleteMyProfile, updateMyProfile } = require("../controllers/profile_controller");

router.route("/")
  .get( getMyProfile )
  .patch( updateMyProfile )
  .delete( deleteMyProfile );

  module.exports = router;