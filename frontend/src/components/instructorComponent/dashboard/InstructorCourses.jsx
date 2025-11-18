import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InstructorCourses = ({ listOfCourses }) => {
  const navigate = useNavigate();

  return (
    <Card className="w-full">
      {/* Responsive Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="text-2xl sm:text-3xl font-extrabold">
          All Courses
        </CardTitle>

        <Button
          className="w-full sm:w-auto py-5 cursor-pointer"
          onClick={() => navigate("/instructor/create-new-course")}
        >
          Create New Course
        </Button>
      </CardHeader>

      {/* Responsive Table */}
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table className="min-w-[650px] w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm sm:text-base">Course</TableHead>
                <TableHead className="text-sm sm:text-base">Students</TableHead>
                <TableHead className="text-sm sm:text-base">Revenue</TableHead>
                <TableHead className="text-right text-sm sm:text-base">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium text-sm sm:text-base">
                      {course.title}
                    </TableCell>
                    <TableCell className="text-sm sm:text-base">
                      {course.students.length}
                    </TableCell>
                    <TableCell className="text-sm sm:text-base">
                      ₹{course.students.length * course.pricing}
                    </TableCell>

                    {/* Action buttons */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button
                          onClick={() =>
                            navigate(`/instructor/edit-course/${course._id}`)
                          }
                          variant="ghost"
                          size="sm"
                          className="p-1 sm:p-2"
                        >
                          <Edit className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1 sm:p-2"
                        >
                          <Delete className="h-5 w-5 sm:h-6 sm:w-6 cursor-pointer" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
                : (
                  <TableRow>
                    <TableCell
                      colSpan="4"
                      className="text-center py-6 text-gray-500 text-sm sm:text-base"
                    >
                      No courses found.
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCourses;
