const router = require("express").Router();
const { signup, signin, signout } = require("../controllers/auth_controller");
const { verifyResetEmailAndSendLink, updatePassword } = require("../controllers/forgot_password_controller");
const { verifyToken } = require("../middlewares/auth");

router.route("/signup")
  .post( signup );

router.route("/signin")
  .post( signin );
  
router.route("/reset")
  .post( verifyResetEmailAndSendLink );

router.route("/reset/:token")
  .patch( updatePassword );

router.route("/signout")
  .post( verifyToken, signout );

module.exports = router;