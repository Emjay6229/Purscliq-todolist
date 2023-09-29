const router = require('express').Router();
const { 
  getMyProfile, 
  deleteMyProfile, 
  updateMyProfile,
  uploadProfilePhoto
} = require("../controllers/profile");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "../uploads/images"),

  filename: (req, file, cb) => {
    const [fileName, ext] = file.originalname.split(".");
    const newFileName = `${fileName}-${Date.now()}.${ext}`
    cb(null, newFileName);
  },
});

const upload = multer({ storage });

router.route("/")
  .get( getMyProfile )
  .patch( updateMyProfile )
  .delete( deleteMyProfile );

router.route("/upload").put(upload.single('image'), uploadProfilePhoto);

module.exports = router;