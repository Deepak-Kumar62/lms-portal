import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";

const InstructorDashboard = ({ listOfCourses }) => {

    function calculateTotalStudentsAndProfit() {
        const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
            (acc, course) => {
                const studentCount = course.students.length;
                acc.totalStudents += studentCount;
                acc.totalProfit += course.pricing * studentCount;

                course.students.forEach((student) => {
                    acc.studentList.push({
                        courseTitle: course.title,
                        studentName: student.studentName,
                        studentEmail: student.studentEmail,
                    });
                });

                return acc;
            },
            {
                totalStudents: 0,
                totalProfit: 0,
                studentList: [],
            }
        );

        return {
            totalProfit,
            totalStudents,
            studentList,
        };
    }

    const config = [
        {
            icon: Users,
            label: "Total Students",
            value: calculateTotalStudentsAndProfit().totalStudents,
        },
        {
            icon: DollarSign,
            label: "Total Revenue",
            value: calculateTotalStudentsAndProfit().totalProfit,
        },
    ];

    return (
        <div className="w-full">

            {/* ---------- STATS CARDS (RESPONSIVE GRID) ---------- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {config.map((item, index) => (
                    <Card key={index} className="shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base sm:text-lg font-medium">
                                {item.label}
                            </CardTitle>
                            <item.icon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl sm:text-3xl font-bold">{item.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ---------- STUDENTS LIST TABLE ---------- */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Students List</CardTitle>
                </CardHeader>

                <CardContent>
                    {/* Makes the table scroll horizontally on mobile */}
                    <div className="overflow-x-auto rounded-md border">
                        <Table className="min-w-[600px] w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-sm sm:text-base">Course Name</TableHead>
                                    <TableHead className="text-sm sm:text-base">Student Name</TableHead>
                                    <TableHead className="text-sm sm:text-base">Student Email</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {calculateTotalStudentsAndProfit().studentList.map(
                                    (studentItem, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium text-sm sm:text-base">
                                                {studentItem.courseTitle}
                                            </TableCell>
                                            <TableCell className="text-sm sm:text-base">
                                                {studentItem.studentName}
                                            </TableCell>
                                            <TableCell className="text-sm sm:text-base">
                                                {studentItem.studentEmail}
                                            </TableCell>
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
};

export default InstructorDashboard;
