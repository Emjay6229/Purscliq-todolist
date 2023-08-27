const router = require("express").Router();

const { userSignup, userSignin, userSignout } = require("../controllers/auth_controller");
const { verifyResetEmailAndSendLink, updatePassword } = require("../controllers/forgot_password_controller");
const { verifyToken } = require("../middlewares/auth");

router.route("/signup")
  .post( userSignup )

router.route("/signin")
  .post( userSignin )
  
router.route("/password/reset")
  .post( verifyResetEmailAndSendLink )

router.route("/password/reset/:token")
  .patch( updatePassword )

router.route("/signout")
  .post( verifyToken, userSignout )

module.exports = router;