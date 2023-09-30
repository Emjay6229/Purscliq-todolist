const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/images"),

  filename: (req, file, cb) => {
    const [fileName, ext] = file.originalname.split(".");
    const newFileName = `${fileName}-${Date.now()}.${ext}`
    cb(null, newFileName);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };