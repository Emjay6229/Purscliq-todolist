const router = require("express").Router()
const { 
    getSignUpForm, 
    getSignInForm, 
    getResetPasswordForm,
    getNewPasswordForm
  } = require("../controllers/page_controller")

const { verifyResetEmailAndSendLink, updatePassword } = require("../controllers/resetUserPassword_controller")
const { 
        userSignup, 
        userSignin, 
        userSignout,
        updateMyProfile,
        getMyProfile,
        deleteMyProfile
    } = require("../controllers/auth_controller")

const { verifyToken } = require("../middlewares/auth")

router.route("/signup")
  .get( getSignUpForm )
  .post( userSignup )

router.route("/signin")
  .get( getSignInForm )
  .post( userSignin )

router.route("/:userId")
  .get( verifyToken, getMyProfile )
  .patch( verifyToken, updateMyProfile )
  .delete( verifyToken, deleteMyProfile )
  
router.route("/resetPassword")
  .get( getResetPasswordForm )
  .post( verifyResetEmailAndSendLink )

router.route("/resetPassword/:token")
  .get( getNewPasswordForm )
  .patch( updatePassword )

router.route("/signout")
  .post( verifyToken, userSignout )

module.exports = router;