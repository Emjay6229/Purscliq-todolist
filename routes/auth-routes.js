const router = require("express").Router();
const { signup, signin } = require("../controllers/auth");
const { verifyResetEmailAndSendLink, updatePassword } = require("../controllers/forgot-password-controller");

router.route("/signup").post( signup );
router.route("/signin").post( signin );
router.route("/reset").post( verifyResetEmailAndSendLink );
router.route("/reset/:token").patch( updatePassword );

module.exports = router;