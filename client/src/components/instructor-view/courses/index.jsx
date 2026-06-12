import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { Switch } from "@/components/ui/switch";


function InstructorCourses({lisOfCourses}) {
 
    const {auth} =useContext(AuthContext)
    const navigate = useNavigate();
    const {setCurrentEditedCourseId,setCourseLandingFormData,setCourseCurriculumFormData } = useContext(InstructorContext);

    console.log("Instructor ID:",     auth?.user?._id);
    console.log("List of Courses:", lisOfCourses);
    // Filter courses to only include those uploaded by the logged-in instructor
    // const filteredCourses = lisOfCourses.filter(course =>course.auth?.user?._id ===auth?.user?._id);
    const filteredCourses = lisOfCourses.filter(course => {
        const instructorId = auth?.user?._id;
        const courseInstructorId = course.instructorId;
        const isMatch = courseInstructorId === instructorId;
        console.log(`Course ID: ${course._id}, Instructor ID: ${courseInstructorId}, Match: ${isMatch}`);
        return isMatch;
    });
    

    console.log(filteredCourses,"instructor course list");
   
    return ( 
        <Card>
            <CardHeader className="flex justify-between flex-row items-center">
                <CardTitle className="text-3xl font-extrabold"> All Courses</CardTitle>
                <Button onClick={()=>navigate('/instructor/create-new-course')} className="p-5 bg-red-800" style={{ border: '3px solid black' }}>
                    Create a New Course
                </Button>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">

                <Table>
                  <TableCaption>A list of your recent courses.</TableCaption>
                  <TableHeader>
                    <TableRow>
                    <TableHead >Course</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {
                        filteredCourses.length > 0 ? filteredCourses.map(course=><TableRow  key={course._id}>
                            <TableCell className="font-medium">{course?.title}</TableCell>
                            <TableCell>{course?.students?.length}</TableCell>
                            <TableCell>${course?.students?.length * course?.pricing}</TableCell>
                            <TableCell className="text-right">
                                <Button  onClick={() => {
                                setCurrentEditedCourseId(null)
                                setCourseLandingFormData(courseLandingInitialFormData)
                                setCourseCurriculumFormData(courseCurriculumInitialFormData)
                                navigate(`/instructor/edit-course/${course?._id}`);
                    
                                }} 
                                variant="ghost" size="sm">
                                 <Edit className="h-6 w-6"/>
                                </Button>
                                {/* <Button variant="ghost" size="sm" className="ml-2">
                                <Delete className="h-6 w-6"/>
                                </Button> */}
                            </TableCell>
                           </TableRow>) : null 
                        
                    }
                   
                 </TableBody>
                </Table>

                </div>
            </CardContent>
        </Card>
 );
}

export default InstructorCourses;