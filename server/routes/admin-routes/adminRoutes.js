const express = require("express");
const { getInstructors, deleteInstructor,getStudents, deleteStudent,updateInstructorAccess} = require("../../controllers/admin-controller/adminController");
const router = express.Router();

router.get("/instructors", getInstructors);
router.delete("/instructor/:id", deleteInstructor);
router.put("/instructor/:id/access", updateInstructorAccess); // Update instructor access if applicable
router.get("/students", getStudents);
router.delete("/student/:id", deleteStudent);

module.exports = router;