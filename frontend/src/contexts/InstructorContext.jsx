import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config"
import { bulkMediaUpload, mediaDelete, mediaUpload } from "@/services/mediaServices"
import { createContext, useContext, useState } from "react"
import { toast } from "react-toastify"

const InstructorContext = createContext(null)

export const InstructorContextProvider = ({ children }) => {
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

        if (!selectedFiles) {
            toast.error("Please select a file")
            return
        }

        const bulkFormData = new FormData();
        selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

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
            isCourseCurriculumFormDataValid
        }}>
            {children}
        </InstructorContext.Provider>
    )
}

export const useInstructorContext = () => useContext(InstructorContext)