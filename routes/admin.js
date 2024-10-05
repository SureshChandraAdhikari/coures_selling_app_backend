const { Router } = require("express");
const adminRouter = Router();
const { adminModel } = require("../db");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const {z} = require('zod');


Admin_Secret = "147asdfa"
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