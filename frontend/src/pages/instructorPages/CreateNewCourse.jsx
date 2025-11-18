import CourseCurriculum from "@/components/instructorComponent/createNewCourse/CourseCurriculum";
import CourseLanding from "@/components/instructorComponent/createNewCourse/CourseLanding";
import CourseSettings from "@/components/instructorComponent/createNewCourse/CourseSettings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstructorContext } from "@/contexts/InstructorContext";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const CreateNewCourse = () => {
    const {
        handleCreateCourses,
        courseLandingFormData,
        courseCurriculumFormData,
        currentEditedCourseId,
        setCurrentEditedCourseId,
        fetchCurrentCourseDetails
    } = useInstructorContext()

    const params = useParams()

    function isEmpty(value) {
        if (Array.isArray(value)) {
            return value.length === 0;
        }
        return value === "" || value === null || value === undefined;
    }

    function validateFormData() {
        for (const key in courseLandingFormData) {
            if (isEmpty(courseLandingFormData[key])) {
                return false;
            }
        }

        let hasFreePreview = false;

        for (const item of courseCurriculumFormData) {
            if (
                isEmpty(item.title) ||
                isEmpty(item.videoUrl) ||
                isEmpty(item.public_id)
            ) {
                // console.log(item)
                return false;
            }

            if (item.freePreview) {
                hasFreePreview = true; //found at least one free preview
            }
        }

        return hasFreePreview;
    }

    useEffect(() => {
        if (params?.courseId) {
            setCurrentEditedCourseId(params.courseId)
        }
    }, [params?.courseId])

    useEffect(() => {
        if (currentEditedCourseId) {
            fetchCurrentCourseDetails()
        }
    }, [currentEditedCourseId])


    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
            <ToastContainer position="top-right" autoClose={2000} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold">
                    Create a New Course
                </h1>

                <Button
                    disabled={!validateFormData()}
                    className="text-sm tracking-wider font-bold px-6 py-3"
                    onClick={handleCreateCourses}
                >
                    SUBMIT
                </Button>
            </div>

            {/* Main Card */}
            <Card className="shadow-md">
                <CardContent className="p-3 sm:p-6">
                    <Tabs defaultValue="curriculum" className="space-y-6">
                        {/* TAB BUTTONS */}
                        <TabsList className="flex flex-wrap w-full justify-start sm:justify-normal gap-2 sm:gap-4">
                            <TabsTrigger value="curriculum" className="text-sm sm:text-base">
                                Curriculum
                            </TabsTrigger>

                            <TabsTrigger
                                value="course-landing-page"
                                className="text-sm sm:text-base"
                            >
                                Course Landing Page
                            </TabsTrigger>

                            <TabsTrigger value="settings" className="text-sm sm:text-base">
                                Settings
                            </TabsTrigger>
                        </TabsList>

                        {/* TAB CONTENT */}
                        <TabsContent value="curriculum">
                            <CourseCurriculum />
                        </TabsContent>

                        <TabsContent value="course-landing-page">
                            <CourseLanding />
                        </TabsContent>

                        <TabsContent value="settings">
                            <CourseSettings />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateNewCourse;
