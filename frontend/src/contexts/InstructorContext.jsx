import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config"
import { bulkMediaUpload, mediaDelete, mediaUpload } from "@/services/mediaServices"
import { createContext, useContext, useState } from "react"
import { toast } from "react-toastify"
import { useAuthContext } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import { createCourse, fetchInstructorCourseDetails, updateCourse } from "@/services/instructorCourseService"

const InstructorContext = createContext(null)

export const InstructorContextProvider = ({ children }) => {

    const { user } = useAuthContext()

    const navigate = useNavigate()

    const [
        courseCurriculumFormData,
        setCourseCurriculumFormData
    ] = useState(courseCurriculumInitialFormData)

    const [
        courseLandingFormData,
        setCourseLandingFormData
    ] = useState(courseLandingInitialFormData)

    const [mediaUploadProgress, setMediaUploadProgress] = useState(false)

    const [
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage
    ] = useState(0)

    const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null)

    const [instructorCoursesList, setInstructorCoursesList] = useState([])

    const handleSingleLectureUpload = async (event, currentIndex) => {
        const selectedFiles = event.target.files[0]

        if (!selectedFiles) {
            toast.error("Please select a file")
            return
        }

        const videoFormData = new FormData()
        videoFormData.append("file", selectedFiles)

        try {
            setMediaUploadProgress(true)
            const response = await mediaUpload(videoFormData, setMediaUploadProgressPercentage)

            if (response?.data?.success) {
                let courseCurriculumFormDataCopy = [...courseCurriculumFormData]

                courseCurriculumFormDataCopy[currentIndex] = {
                    ...courseCurriculumFormDataCopy[currentIndex],
                    videoUrl: response?.data?.data?.url,
                    public_id: response?.data?.data?.public_id,
                }

                setCourseCurriculumFormData(courseCurriculumFormDataCopy)
                setMediaUploadProgress(false)
            }
        } catch (error) {
            console.log(error)
            setMediaUploadProgressPercentage(0)
            setMediaUploadProgress(false)
            toast.error("Something went wrong")
        }
    }

    const handleLectureReplace = async (currentIndex) => {
        try {
            let courseCurriculumFormDataCopy = [...courseCurriculumFormData];
            const currentVideoPublicId =
                courseCurriculumFormDataCopy[currentIndex].public_id;

            const response = await mediaDelete(
                currentVideoPublicId
            );

            if (response?.data?.success) {
                courseCurriculumFormDataCopy[currentIndex] = {
                    ...courseCurriculumFormDataCopy[currentIndex],
                    videoUrl: "",
                    public_id: "",
                };

                setCourseCurriculumFormData(courseCurriculumFormDataCopy);
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    const handleLectureDelete = async (currentIndex) => {
        try {
            let courseCurriculumFormDataCopy = [...courseCurriculumFormData];
            const currentVideoPublicId =
                courseCurriculumFormDataCopy[currentIndex].public_id;

            const response = await mediaDelete(currentVideoPublicId);

            if (response?.data?.success) {
                courseCurriculumFormDataCopy = courseCurriculumFormDataCopy.filter(
                    (_, index) => index !== currentIndex
                );

                setCourseCurriculumFormData(courseCurriculumFormDataCopy);
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    const handleLectureTitleChange = (event, currentIndex) => {
        let courseCurriculumFormDataCopy = [...courseCurriculumFormData]
        courseCurriculumFormDataCopy[currentIndex] = {
            ...courseCurriculumFormDataCopy[currentIndex],
            title: event.target.value
        }
        setCourseCurriculumFormData(courseCurriculumFormDataCopy)
    }

    const checkCourseCurriculumFormDataObjectsEmpty = (arr) => {
        return arr.every((obj) => {
            return Object.entries(obj).every(([key, value]) => {
                if (typeof value === "boolean") {
                    return true;
                }
                return value === "";
            });
        });
    }

    async function handleBulkLectureUpload(event) {
        const selectedFiles = Array.from(event.target.files);

        // console.log(selectedFiles)

        if (selectedFiles.length === 0) {
            toast.error("Please select at least one file");
            return;
        }


        const bulkFormData = new FormData();

        selectedFiles.forEach((fileItem) => {
            bulkFormData.append("files", fileItem)
        });

        // To verify:
        // for (let pair of bulkFormData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }


        try {
            setMediaUploadProgress(true);
            const response = await bulkMediaUpload(
                bulkFormData,
                setMediaUploadProgressPercentage
            );

            if (response?.data?.success) {
                let courseCurriculumFormDataCopy =
                    checkCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
                        ? []
                        : [...courseCurriculumFormData];

                courseCurriculumFormDataCopy = [
                    ...courseCurriculumFormDataCopy,
                    ...response?.data?.data?.map((item, index) => ({
                        videoUrl: item?.url,
                        public_id: item?.public_id,
                        title: `Lecture ${courseCurriculumFormDataCopy.length + (index + 1)
                            }`,
                        freePreview: false,
                    })),
                ];
                setCourseCurriculumFormData(courseCurriculumFormDataCopy);
                setMediaUploadProgress(false);
            }
        } catch (error) {
            console.log(error)
            setMediaUploadProgressPercentage(0)
            setMediaUploadProgress(false)
            toast.error("Something went wrong")
        }
    }

    const handleLectureFreePreviewChange = (currentValue, currentIndex) => {
        let courseCurriculumFormDataCopy = [...courseCurriculumFormData];
        courseCurriculumFormDataCopy[currentIndex] = {
            ...courseCurriculumFormDataCopy[currentIndex],
            freePreview: currentValue,
        };

        setCourseCurriculumFormData(courseCurriculumFormDataCopy);
    }

    const handleAddLecture = () => {
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            ...courseCurriculumInitialFormData
        ])
    }

    const isCourseCurriculumFormDataValid = () => {
        return courseCurriculumFormData.every((item) => {
            return (
                item &&
                typeof item === "object" &&
                item.title.trim() !== "" &&
                item.videoUrl.trim() !== ""
            );
        });
    }

    const handleImageUpload = async (event) => {
        const selectedImage = event.target.files[0];

        if (!selectedImage) {
            toast.error("Please select a file")
            return
        }

        const imageFormData = new FormData();
        imageFormData.append("file", selectedImage);

        try {
            setMediaUploadProgress(true);
            const response = await mediaUpload(
                imageFormData,
                setMediaUploadProgressPercentage
            );

            if (response?.data?.success) {
                setCourseLandingFormData({
                    ...courseLandingFormData,
                    image: response.data.data?.url,
                });
            }
            setMediaUploadProgress(false);
        } catch (error) {
            console.log(error)
            setMediaUploadProgressPercentage(0)
            setMediaUploadProgress(false)
            toast.error("Something went wrong")
        }
    }

    const handleCreateCourses = async () => {
        try {
            const finalCourseFormData = {
                instructorId: user?._id,
                instructorName: user?.userName,
                date: new Date(),
                ...courseLandingFormData,
                students: [],
                curriculum: courseCurriculumFormData,
                isPublised: true,
            };

            const response =
                currentEditedCourseId !== null
                    ? await updateCourse(
                        currentEditedCourseId,
                        finalCourseFormData
                    )
                    : await createCourse(finalCourseFormData);

            if (response?.data?.success) {
                setCourseLandingFormData(courseLandingInitialFormData);
                setCourseCurriculumFormData(courseCurriculumInitialFormData);
                navigate(-1);
                setCurrentEditedCourseId(null);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }

    async function fetchCurrentCourseDetails() {
        const response = await fetchInstructorCourseDetails(
            currentEditedCourseId
        );

        if (response?.data?.success) {
            const courseFormData = Object.keys(
                courseLandingInitialFormData
            ).reduce((acc, key) => {
                acc[key] = response?.data?.data[key] || courseLandingInitialFormData[key];

                return acc;
            }, {});

            setCourseLandingFormData(courseFormData);
            setCourseCurriculumFormData(response?.data?.data?.curriculum);
        }
    }

    // console.log(courseCurriculumFormData)

    return (
        <InstructorContext.Provider value={{
            courseCurriculumFormData,
            setCourseCurriculumFormData,
            courseLandingFormData,
            setCourseLandingFormData,
            handleSingleLectureUpload,
            mediaUploadProgress,
            mediaUploadProgressPercentage,
            handleLectureTitleChange,
            handleLectureFreePreviewChange,
            handleLectureReplace,
            handleLectureDelete,
            handleBulkLectureUpload,
            handleAddLecture,
            isCourseCurriculumFormDataValid,
            handleImageUpload,
            handleCreateCourses,
            currentEditedCourseId,
            setCurrentEditedCourseId,
            fetchCurrentCourseDetails,
            instructorCoursesList,
            setInstructorCoursesList
        }}>
            {children}
        </InstructorContext.Provider>
    )
}

export const useInstructorContext = () => useContext(InstructorContext)