const User = require("../../models/User");

// Fetch all instructors

exports.getInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ role: "instructor" });
        res.json(instructors);
    } catch (error) {
        console.error("Error fetching instructors:", error);
        res.status(500).json({ message: "Failed to fetch instructors" });
    }
};


// Delete instructor
exports.deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Instructor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete instructor" });
    }
};

exports.updateInstructorAccess = async (req, res) => {
    const { id } = req.params;
    const { access } = req.body; // Expecting the new access state to be sent in the request body

    try {
        // Find the instructor by ID and update their access state
        const updatedInstructor = await User.findByIdAndUpdate(
            id,
            { access }, // Update the access field with the new value
            { new: true } // Return the updated document
        );

        if (!updatedInstructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }

        res.status(200).json(updatedInstructor);
    } catch (error) {
        console.error("Error updating instructor access:", error);
        res.status(500).json({ message: "Failed to update instructor access" });
    }
};




// for student list 
exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: "user" });
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Failed to fetch students" });
    }
};


// Delete student
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete Student" });
    }
};