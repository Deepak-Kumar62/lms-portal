import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useAuthContext } from '@/contexts/AuthContext';
import { fetchStudentBoughtCourses } from '@/services/studentCoursesService';
import { Watch } from 'lucide-react';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const { user } = useAuthContext()

  const [
    studentBoughtCoursesList,
    setStudentBoughtCoursesList
  ] = useState([])

  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();

  async function handleFetchStudentBoughtCourses() {
    try {
      const response = await fetchStudentBoughtCourses(user?._id);

      if (response?.data?.success) {
        setStudentBoughtCoursesList(response?.data?.data);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setStudentBoughtCoursesList([])
    }
  }

  useEffect(() => {
    handleFetchStudentBoughtCourses();
  }, []);

  if (loading) {
    return <div className='text-center mt-4 text-2xl w-full min-h-screen'>Loading...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          studentBoughtCoursesList.map((course) => (
            <Card key={course._id} className="flex flex-col">
              <CardContent className="p-4 grow">
                <img
                  src={course?.courseImage}
                  alt={course?.title}
                  className="h-52 w-full object-cover rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-sm text-gray-700 mb-2">
                  {course?.instructorName}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    navigate(`/course-progress/${course?.courseId}`)
                  }
                  className="flex-1"
                >
                  <Watch className="mr-2 h-4 w-4" />
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <h1 className="text-2xl font-bold w-full min-h-screen">No Courses found</h1>
        )}
      </div>
    </div>
  );
}

export default MyCourses