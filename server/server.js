require('dotenv').config();  //automatically import the env variables
const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth-routes/index');
const mediaRoutes = require('./routes/instructor-routes/media-routes');
const instructorCourseRoutes = require('./routes/instructor-routes/course-routes');
const studentViewCourseRoutes = require('./routes/student-routes/course-routes');
const studentViewOrderRoutes = require('./routes/student-routes/order-routes');
const studentCoursesRoutes = require('./routes/student-routes/student-courses-routes');
const studentCourseProgressRoutes = require('./routes/student-routes/course-progress-routes');
const adminRoutes = require("./routes/admin-routes/adminRoutes");


const app = express();
const PORT = process.env.PORT || 5000;    //backend will run at this port
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
    origin: process.env.CLIENT_URL,
    // origin: 'http://localhost:5173',
    methods: ["GET", "POST", "DELETE", "PUT",'PATCH'],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

//database connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB is connected'))
    .catch((e) => console.log(e));

//routes configuration
app.use('/auth', authRoutes);
app.use("/media",mediaRoutes);
app.use("/instructor/course",instructorCourseRoutes);
app.use("/student/course",studentViewCourseRoutes);
app.use("/student/order",studentViewOrderRoutes);
app.use("/student/courses-bought",studentCoursesRoutes);
app.use("/student/course-progress",studentCourseProgressRoutes);
app.use("/api/admin",adminRoutes);

//Global error handling 
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
    });
});

//port listening 
app.listen(PORT, () => {
    console.log(`Server is now running on the port ${PORT}`);
});
