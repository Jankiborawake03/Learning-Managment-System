import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

function InstructorDashboard({ lisOfCourses }) {
  const { auth } = useContext(AuthContext); // Get the logged-in instructor's information
  function calculateTotalStudentsAndProfit() {
    // Filter courses based on the logged-in instructor's ID
    const instructorCourses = lisOfCourses.filter(course => course.instructorId === auth?.user?._id);
    const { totalProfit, studentList,studentSet } = instructorCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalProfit += course.pricing * studentCount;

        course.students.forEach((student) => {
          // Assuming that student email is unique 
          acc.studentSet.add(student.studentEmail);
          acc.studentList.push({
            courseTitle: course.title,
            coursePricing: course.pricing,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalProfit: 0,
        studentList: [],
        // Initialize a Set to track unique students
        studentSet: new Set(),
      }
    );

    return {
      totalProfit,
      // Use the size of the Set for unique count
      totalStudents: [...studentSet].length, // Correctly calculate unique students
      studentList,
    };
  }

  const totalData = calculateTotalStudentsAndProfit();

  const config = [
    {
      icon: Users,
      label: 'Total Students',
      value: totalData.totalStudents, // Use the updated totalStudents
    },
    {
      icon: DollarSign,
      label: 'Total Revenue',
      value: totalData.totalProfit,
    }
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {
          config.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.label}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {item.value}
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Course Revenue</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Student Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {totalData.studentList.map(
                  (studentItem, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {studentItem.courseTitle}
                      </TableCell>
                      <TableCell>${studentItem.coursePricing}</TableCell>
                      <TableCell>{studentItem.studentName}</TableCell>
                      <TableCell>{studentItem.studentEmail}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InstructorDashboard;
