const router = require("express").Router();

const { signup, signin } = require("../controllers/auth_controller");

const { 
  verifyResetEmailAndSendLink, 
  updatePassword 
} = require("../controllers/forgot_password_controller");

router.route("/signup").post( signup );

router.route("/signin").post( signin );
  
router.route("/reset").post( verifyResetEmailAndSendLink );

router.route("/reset/:token").patch( updatePassword );

module.exports = router;