const router = require('express').Router();
const { upload } = require("../middlewares/multer");
const { getMyProfile, deleteMyProfile, updateMyProfile, uploadProfilePhoto } = require("../controllers/profile");

router.route("/")
  .get( getMyProfile )
  .patch( updateMyProfile )
  .delete( deleteMyProfile );

router.route("/upload").post(upload.single("profileImg"), uploadProfilePhoto);

module.exports = router;