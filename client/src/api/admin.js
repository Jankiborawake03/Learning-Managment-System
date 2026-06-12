import axios from "axios";



export const fetchInstructors = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/admin/instructors"); // Ensure correct API URL
        console.log("API Response:", response.data);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching instructors:", error.response?.data || error.message);
        return [];
    }
};


export const deleteInstructor = async (id) => {
    try {
        await axios.delete(`/api/admin/instructor/${id}`);
    } catch (error) {
        console.error("Error deleting instructor:", error);
    }
};


export const updateInstructorAccess = async (id, access) => {
    try {
        // Send the new access state to the backend
        const response = await axios.put(`/api/admin/instructor/${id}/access`, { access }); // Ensure access is a boolean
        console.log("Instructor access updated:", response.data);
        return response.data; // Return the updated instructor data
    } catch (error) {
        console.error("Error updating instructor access:", error.response?.data || error.message);
        return null; // Return null in case of an error
    }
};


// for students 
export const fetchStudents = async () => {
    try {
        const response = await axios.get("http://localhost:5000/api/admin/students"); // Ensure correct API URL
        console.log("API Response:", response.data);
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching students:", error.response?.data || error.message);
        return [];
    }
};


export const deleteStudent = async (id) => {
    try {
        await axios.delete(`/api/admin/student/${id}`);
    } catch (error) {
        console.error("Error deleting student:", error);
    }
};