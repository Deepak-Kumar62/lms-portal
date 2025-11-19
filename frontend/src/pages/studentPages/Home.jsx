import { Button } from '@/components/ui/button'
import { courseCategories } from '@/config'
import banner from "../../assets/banner-img.png"
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchAllCoursesForStudent } from '@/services/stdentService'

const Home = () => {
    const [studentViewCoursesList, setStudentViewCoursesList] = useState([])

    const navigate = useNavigate()

    const handleNavigateToCoursesExplorePage = (categoryItemId) => {
        sessionStorage.removeItem("filters")
        sessionStorage.setItem("filters", JSON.stringify({ category: [categoryItemId] }))
        navigate("/explore-courses")
    }

    const fetchAllCourses = async () => {
        try {
            const response = await fetchAllCoursesForStudent()

            if (response?.data?.success) {
                setStudentViewCoursesList(response?.data?.data)
            }
        } catch (error) {
            setStudentViewCoursesList([])
        }
    }

    const handleCourseNavigate = (courseId) => {
        navigate(`/course/${courseId}`)
    }

    useEffect(() => {
        fetchAllCourses()
    }, [])

    return (
        <main className="min-h-screen bg-white flex flex-col">

            {/* ===================== HERO SECTION ===================== */}
            <section className="flex flex-col-reverse lg:flex-row items-center justify-between py-10 px-4 md:px-8 gap-10">

                {/* TEXT BOX */}
                <div className="w-full lg:w-1/2 text-center lg:text-left space-y-4">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-purple-700">
                        Learning that gets you
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700">
                        Skills for your present and your future. Get started with us.
                    </p>
                </div>

                {/* IMAGE */}
                <div className="w-full lg:w-1/2 flex justify-center">
                    <img
                        src={banner}
                        className="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-lg shadow-lg object-cover"
                        alt="Banner"
                    />
                </div>
            </section>

            {/* ===================== CATEGORY SECTION ===================== */}
            <section className="py-10 px-4 md:px-8 bg-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
                    Course Categories
                </h2>

                <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
                >

                    {courseCategories.map((categoryItem) => (
                        <Button
                            key={categoryItem.id}
                            variant="outline"
                            onClick={() => handleNavigateToCoursesExplorePage(categoryItem.id)}
                            className="w-full justify-center sm:justify-start text-xs sm:text-sm md:text-[15px] font-medium py-2 sm:py-3 whitespace-normal wrap-break-words"
                        >
                            {categoryItem.label}
                        </Button>
                    ))}
                </div>
            </section>


            {/* ===================== FEATURED COURSES ===================== */}
            <section className="py-12 px-4 md:px-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
                    Featured Courses
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {studentViewCoursesList.length > 0 ? (
                        studentViewCoursesList.map((courseItem) => (
                            <div
                                key={courseItem._id}
                                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
                                onClick={() => handleCourseNavigate(courseItem._id)}
                            >
                                <img
                                    src={courseItem?.image}
                                    className="w-full h-40 sm:h-48 object-cover"
                                    alt={courseItem?.title}
                                />

                                <div className="p-4 space-y-2">
                                    <h3 className="font-bold text-lg">{courseItem?.title}</h3>
                                    <p className="text-sm text-gray-700">{courseItem?.instructorName}</p>
                                    <p className="font-bold text-[16px]">${courseItem?.pricing}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-xl sm:text-2xl text-center col-span-full">
                            No Courses Found
                        </p>
                    )}
                </div>
            </section>

        </main>
    )
}

export default Home
