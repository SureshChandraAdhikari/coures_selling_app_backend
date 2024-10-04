const { Router } = require('express')
const userRouter = Router();
const { userModel } = require("../db");

userRouter.post("/signUp", function (req, res) {
  res.json({
    message: "Sign Up Route",
  });
});

userRouter.post("/signIn", function (req, res) {
  res.json({
    message: "Sign In Route",
  });
});

userRouter.post("/mycourses", function (req, res) {
  res.json({
    message: "my course Route",
  });
});

module.exports = {userRouter: userRouter}