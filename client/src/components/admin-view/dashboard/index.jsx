import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Delete, Edit, Users } from "lucide-react";
import { AdminContext } from "@/context/admin-context";
import { fetchInstructors, deleteInstructor,updateInstructorAccess } from "@/api/admin";
import { fetchStudents, deleteStudent } from "@/api/admin";
import { fetchInstructorCourseListService } from "@/services"; // Ensure this path is correct
import { Switch } from "@/components/ui/switch";

function AdminDashboard() {
    const navigate = useNavigate();
    const { setCurrentEditedInstructorId } = useContext(AdminContext);
    const [listOfInstructors, setListOfInstructors] = useState([]);
    const [listOfStudents, setListOfStudents] = useState([]);
    const [instructorCourseCounts, setInstructorCourseCounts] = useState({}); // State for course counts

    useEffect(() => {
        // Fetch instructors
        fetchInstructors().then((data) => {
            console.log("Fetched instructors:", data);
            setListOfInstructors(Array.isArray(data) ? data : []);
        });

        // Fetch courses and calculate counts
        fetchInstructorCourseListService().then((response) => {
            console.log("Fetched courses response:", response); // Log the entire response

            // Extract the data array from the response
            const courses = response.data; // Assuming response structure is { success: true, data: [...] }

            // Check if courses is an array
            if (Array.isArray(courses)) {
                const counts = courses.reduce((acc, course) => {
                    const instructorId = course.instructorId;
                    acc[instructorId] = (acc[instructorId] || 0) + 1; // Count courses per instructor
                    return acc;
                }, {});
                setInstructorCourseCounts(counts); // Update state with course counts
            } else {
                console.error("Expected an array but got:", courses);
                setInstructorCourseCounts({}); // Reset counts if not an array
            }
        }).catch(error => {
            console.error("Error fetching courses:", error);
        });

        // Fetch students
        fetchStudents().then((data) => {
            console.log("Fetched students:", data);
            setListOfStudents(Array.isArray(data) ? data : []);
        });
    }, []); // Empty dependency array to run once on mount

    const handleDelete = async (id) => {
        await deleteInstructor(id);
        setListOfInstructors(listOfInstructors.filter(instructor => instructor._id !== id));
    };

    const handleDelete1 = async (id) => {
        await deleteStudent(id);
        setListOfStudents(listOfStudents.filter(student => student._id !== id));
    };

    const handleAccessToggle = async (instructorId, currentAccess) => {
        const newAccess = !currentAccess; // Toggle the access state
        console.log("Toggling access for instructor:", instructorId, "New access state:", newAccess);
        
        const result = await updateInstructorAccess(instructorId, newAccess); // Pass the newAccess directly
        // Note: No need to wrap newAccess in an object here
        if (result) {
            setListOfInstructors(prevInstructors =>
                prevInstructors.map(instructor =>
                    instructor._id === instructorId ? { ...instructor, access: newAccess } : instructor
                )
            );
        } else {
            console.error("Failed to update access for instructor:", instructorId);
        }
    };
    


    return (
        <div>
            <div className="mb-2 p-2 bg-gray-100 rounded-lg shadow-md flex justify-start">
                <p className="text-lg font-bold text-gray-800 flex items-center">
                    <p>Total Instructors </p><Users className="m-2" /> <span className="text-gray-800 ml-1">{listOfInstructors.length}</span>
                </p>
                <p className="text-lg font-bold text-gray-800 ml-6 flex items-center">
                    <p>Total Students </p><Users className="m-2" /> <span className="text-gray-800 ml-1">{listOfStudents.length}</span>
                </p>
            </div>

            <Card>
                <CardHeader className="flex justify-between flex-row items-center">
                    <CardTitle className="text-3xl font-extrabold">All Instructors</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Instructor</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Courses Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listOfInstructors.length > 0 ? listOfInstructors.map((instructor) => {
                                    return (
                                        <TableRow key={instructor?._id}>
                                            <TableCell className="font-medium">{instructor?.userName}</TableCell>
                                            <TableCell>{instructor?.userEmail}</TableCell>
                                            <TableCell>{instructorCourseCounts[instructor?._id] || 0}</TableCell>
                                            <TableCell className="text-right">
                                            <Switch 
                                             checked={instructor.access} 
                                             onClick={() => handleAccessToggle(instructor._id, instructor.access)} 
                                            />
                                            
                                                {/* <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleDelete(instructor?._id)}>
                                                    <Delete className="h-6 w-6" />
                                                </Button> */}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No instructors found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            <br />
            <Card>
                <CardHeader className="flex justify-between flex-row items-center">
                    <CardTitle className="text-3xl font-extrabold">All Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    {/* <TableHead className="text-right">Action</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {listOfStudents.length > 0 ? listOfStudents.map((student) => (
                                    <TableRow key={student?._id}>
                                        <TableCell className="font-medium">{student?.userName}</TableCell>
                                        <TableCell>{student?.userEmail}</TableCell>
                                        <TableCell className="text-right">
                                            {/* <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleDelete1(student?._id)}>
                                                <Delete className="h-6 w-6" />
                                            </Button> */}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">No students found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default AdminDashboard;
