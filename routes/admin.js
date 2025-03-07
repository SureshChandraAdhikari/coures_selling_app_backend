const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {z} = require('zod');
const {Admin_Secret} = require('../config')
const {adminMiddleware} = require('../middleware')

adminRouter.post("/signUp", async function (req, res) {
  // Define Zod schema for validation
  const adminSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }), // Email must be valid
    password: z
      .string() // Password is a string
      .min(4, { message: "Password must be at least 4 characters long" })
      .max(8, { message: "Password must be at most 8 characters long" }), // Password max length of 8
    firstname: z.string().min(1, { message: "First name is required" }), // First name is required
    lastname: z.string().min(1, { message: "Last name is required" }) // Last name is required
  });

  try {
    // Validate the request body using the schema
    const parsedData = adminSchema.parse(req.body);

    // Destructure the parsed data
    const { email, password, firstname, lastname } = parsedData;

    // Hash the password
    const salt = await bcrypt.genSalt(6);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the admin in the database
    const admin = await adminModel.create({
      email: email,
      password: hashedPassword, // Store the hashed password
      firstName: firstname,
      lastName: lastname, // Ensure your database schema uses lastName (check the casing)
    });

    // Send response on success
    res.status(201).json({ message: "Admin created successfully", admin });

  } catch (error) {
    // Catch Zod validation errors or other errors like bcrypt or database issues
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    // Log other server-side errors and send response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

adminRouter.post("/signIn", async function (req, res) {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const admin = await adminModel.findOne({ email: email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id }, Admin_Secret);

    // Return success response with the token
    res.json({
      message: "Sign In Successful",
      token: token,
    });
  } catch (error) {
    // Handle server errors
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


adminRouter.post("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price } = req.body;

  
  const course = await courseModel.create({
    title: title,
    description: description,
    imageUrl: imageUrl,
    price: price,
    creatorId: adminId,
  });

  res.json({
    message: "Course created",
    courseId: course._id,
  });
});

adminRouter.put("/course", adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const { title, description, imageUrl, price, courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: "Course ID is required" });
  }
  const course = await courseModel.updateOne(
    {
      _id: courseId,
      creatorId: adminId,
    },
    {
      title: title,
      description: description,
      imageUrl: imageUrl,
      price: price,
    }
  );

  res.json({
    message: "Course updated",
    courseId: course._id,
  });
});

adminRouter.get("/course/bulk", adminMiddleware, async function (req, res) {
  const adminId = req.userId;

  const courses = await courseModel.find({
    creatorId: adminId,
  });

  res.json({
    message: "Course updated",
    courses,
  });
});


module.exports = {adminRouter: adminRouter}