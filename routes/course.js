const { Router } = require("express");
const courseRouter = Router();
const { courseModel } = require("../db");
// Define routes for courseRouter
courseRouter.post("/purchases", function (req, res) {
  res.json({
    message: "Course purchases Route",
  });
});

courseRouter.get("/preview", function (req, res) {
  res.json({
    message: "Course Route",
  });
});

module.exports = { courseRouter };
