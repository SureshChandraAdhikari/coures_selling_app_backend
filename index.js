const express = require("express");
const { userRouter } = require("./routes/user"); // Ensure userRouter is defined in ./routes/user
const { courseRouter } = require("./routes/course"); // Import courseRouter
const { adminRouter } = require("./routes/admin"); 
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);


async function main(){
   await mongoose.connect(
      "mongodb+srv://loginsureshadhikari:GlX7Qd4zifIvjOXl@cluster0.zjjj9.mongodb.net/CourseSellingApp"
    );
    console.log("Connected to MongoDB");
    app.listen(8000, () => {
      console.log("Server is running on port 8000");
    });
}

main();

