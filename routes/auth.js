const express = require("express");
const {
  signup,
  signin,
  signout,
  requireSignin,
  validateToken
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator/index");
const router = express.Router();

router.post("/signup", userSignupValidator, signup);
router.post("/signin",validateToken, signin);
router.get("/signout", requireSignin, signout);

module.exports = router;
