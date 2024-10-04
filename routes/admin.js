const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");
adminRouter.post("/signUp", function (req, res) {
  res.json({
    message: "Sign Up Route",
  });
});

adminRouter.post("/signIn", function (req, res) {
  res.json({
    message: "Sign In Route",
  });
});

adminRouter.post("/courses", function (req, res) {
  res.json({
    message: "my course Route",
  });
});

adminRouter.put("/courses", function (req, res) {
  res.json({
    message: "my course Route",
  });
});

adminRouter.get("/courses/bulk", function (req, res) {
  res.json({
    message: "my course Route",
  });
});


module.exports = {adminRouter: adminRouter}