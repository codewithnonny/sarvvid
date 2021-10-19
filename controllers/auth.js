const User = require("../models/User");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { errorHandler } = require("../helpers/dbErrorHander");
//signup method
exports.signup = (req, res) => {
  console.log("bodyparser", req.body);
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({ error: errorHandler(err) });
    }
    user.salt = undefined;
    user.hashed_passwords = undefined;
    res.json({ user });
  });
};

//signin method
exports.signin = (req, res) => {
  const { email, password } = req.body;

  //user email check db
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "user with that email not found. Please signup",
      });
    }
    //user password authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: "Password don't match",
      });
    }

    //genrating token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    //saving token in cookie with expiry date
    res.cookie("t", token, { expires: new Date(Number(new Date()) + 9999) });

    //frontend response
    const { _id, name, email, role } = user;
    return res.json({ token, user: { _id, name, email, role } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ message: "signout success" });
};

exports.validateToken = (req,res,next)=>{
  const t = req.cookies["t"];
  console.log(req.cookies)
  if(!t){
    return res.status(400).json({error:"user not authorised"})
  }
  const validToken = jwt.verify(t,process.env.JWT_SECRET)
  next();
}

//require signin method
exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

//user authenticate

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    res.status(400).json({ message: "Access denied" });
  }
  next();
};

///admin auth

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(403).json({
      error: "Admin Resource! Access Denied",
    });
  }
};
