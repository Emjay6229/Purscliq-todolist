const router = require("express").Router()
const { 
    getSignUpForm, 
    getSignInForm, 
    getResetPasswordForm,
    getNewPasswordForm
  } = require("../controllers/page_controller")

const { verifyResetEmailAndSendLink } = require("../controllers/verifyResetEmail")
const { updatePassword } = require("../controllers/resetPassword")

const { 
  userSignup, 
  userSignin, 
  userSignout,
  updateUser,
  deleteUser
} = require("../controllers/auth_controller")

const {verifyToken} = require("../middlewares/auth")

router.route("/signup")
  .get( getSignUpForm )
  .post( userSignup )

router.route("/signin")
  .get( getSignInForm )
  .post( userSignin )

router.route("/:id")
  .patch( updateUser )
  .delete( deleteUser )
  
router.route("/resetPassword")
  .get( getResetPasswordForm )
  .post( verifyResetEmailAndSendLink )

router.route("/resetPassword/:token")
  .get( getNewPasswordForm )
  .patch( updatePassword )

router.route("/signout")
  .post( verifyToken, userSignout )


module.exports = router;