import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/VideoPlayer";
import { useAuthContext } from "@/contexts/AuthContext";
import {
    currentCourseProgress,
    markLectureAsViewed,
    resetCourseProgress,
} from "@/services/courseProgressService";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import ReactConfetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

// CourseProgress component
export default function CourseProgress() {
    const [isPurchasedCourses, setIsPurchasedCourses] = useState(false);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState({});

    // Sidebar state
    const [isSideBarOpen, setIsSideBarOpen] = useState(true); // desktop
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // mobile drawer

    const [showConfetti, setShowConfetti] = useState(false);
    const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);

    const { courseId } = useParams();
    const { user } = useAuthContext();
    const navigate = useNavigate();

    // Fetch progress helper
    const fetchCurrentCourseProgress = async () => {
        try {
            const response = await currentCourseProgress(user?._id, courseId);

            if (response?.data?.success) {
                const payload = response.data.data;

                // If course not purchased
                if (!payload?.isPurchased) {
                    setIsPurchasedCourses(true);
                    return;
                }

                setStudentCurrentCourseProgress({
                    courseDetails: payload.courseDetails,
                    progress: payload.progress || [],
                    completed: Boolean(payload.completed),
                });

                // When course already completed
                if (payload.completed) {
                    setShowCourseCompleteDialog(true);
                    setShowConfetti(true);
                    // set first lecture so player has something to show
                    setCurrentLecture(payload.courseDetails?.curriculum?.[0] || null);
                    return;
                }

                // If no progress, start with first lecture
                const progress = payload.progress || [];
                if (!progress.length) {
                    setCurrentLecture(payload.courseDetails?.curriculum?.[0] || null);
                    return;
                }

                // Find last viewed lecture index
                const lastIndexViewed = progress.reduceRight((acc, p, idx) => {
                    return acc === -1 && p.viewed ? idx : acc;
                }, -1);

                const nextLecture = payload.courseDetails?.curriculum?.[lastIndexViewed + 1] || null;
                setCurrentLecture(nextLecture);
            }
        } catch (err) {
            // handle error (toast/log)
            console.error("fetchCurrentCourseProgress error", err);
        }
    };

    // Reset / rewatch
    const handleRewatchCourse = async () => {
        try {
            const response = await resetCourseProgress(
                user?._id,
                studentCurrentCourseProgress?.courseDetails?._id
            );

            if (response?.data?.success) {
                setCurrentLecture(null);
                setShowConfetti(false);
                setShowCourseCompleteDialog(false);
                fetchCurrentCourseProgress();
            }
        } catch (err) {
            console.error("handleRewatchCourse error", err);
        }
    };

    // Mark current lecture viewed when progressValue reaches 1
    async function updateCourseProgress() {
        if (!currentLecture) return;

        try {
            const response = await markLectureAsViewed(
                user?._id,
                studentCurrentCourseProgress?.courseDetails?._id,
                currentLecture._id
            );

            if (response?.data?.success) {
                fetchCurrentCourseProgress();
            }
        } catch (err) {
            console.error("updateCourseProgress error", err);
        }
    }

    useEffect(() => {
        if (currentLecture?.progressValue === 1) {
            updateCourseProgress();
        }
        // We deliberately do not add updateCourseProgress to deps to avoid re-creating the fn
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLecture?.progressValue]);

    useEffect(() => {
        if (courseId) fetchCurrentCourseProgress();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    useEffect(() => {
        if (showConfetti) {
            const id = setTimeout(() => setShowConfetti(false), 7000);
            return () => clearTimeout(id);
        }
    }, [showConfetti]);

    // Utility: map of viewed lectureIds for faster lookup
    const viewedSet = new Set(
        (studentCurrentCourseProgress?.progress || []).map((p) => p.lectureId)
    );

    // Responsive handlers
    const openDrawer = () => setIsDrawerOpen(true);
    const closeDrawer = () => setIsDrawerOpen(false);

    return (
        <div className="flex flex-col min-h-screen bg-[#0f1720] text-white">
            {showConfetti && <ReactConfetti />}

            {/* Header */}
            <div className="flex items-center justify-between h-14 px-3 sm:px-6 bg-[#0f1720] border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <Button
                        onClick={() => navigate("/my-courses")}
                        className="border border-white"
                        variant="ghost"
                        size="sm"
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to My Courses
                    </Button>

                    <h1 className="text-lg font-bold hidden md:block">
                        {studentCurrentCourseProgress?.courseDetails?.title}
                    </h1>

                    {/* Mobile: open content drawer */}
                    <Button
                        className="sm:hidden"
                        variant="ghost"
                        size="sm"
                        onClick={openDrawer}
                        aria-label="Open course content"
                    >
                        Content
                    </Button>
                </div>

                {/* Desktop toggle for sidebar */}
                <div>
                    <Button onClick={() => setIsSideBarOpen((s) => !s)} className="hidden sm:inline-flex">
                        {isSideBarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Main area */}
            <div className="flex flex-1 overflow-hidden">
                <main className={`flex-1 transition-all duration-300 p-4 ${isSideBarOpen ? "sm:mr-[400px]" : ""}`}>
                    {/* Responsive video container: keeps 16:9 ratio */}
                    <div className="w-full max-w-5xl mx-auto">
                        <div className="aspect-video w-full bg-black rounded-md overflow-hidden">
                            <VideoPlayer
                                width="100%"
                                height="100%"
                                url={currentLecture?.videoUrl}
                                onProgressUpdate={setCurrentLecture}
                                progressData={currentLecture}
                            />
                        </div>

                        <div className="mt-4 px-2 sm:px-0">
                            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title || "Select a Lecture"}</h2>
                            <p className="text-sm text-gray-300">
                                {currentLecture?.description || studentCurrentCourseProgress?.courseDetails?.shortDescription}
                            </p>
                        </div>
                    </div>
                </main>

                {/* Sidebar / Drawer */}
                {/* Overlay for mobile drawer when open */}
                {isDrawerOpen && (
                    <div
                        onClick={closeDrawer}
                        className="fixed inset-0 z-40 bg-black/50 sm:hidden"
                        aria-hidden
                    />
                )}

                <aside
                    className={`fixed top-14 right-0 bottom-0 z-50 bg-[#0f1720] border-l border-gray-700 transition-transform duration-300
            ${
                        // mobile: full width when drawer open
                        isDrawerOpen ? "translate-x-0 w-full sm:w-[400px]" : "translate-x-full sm:translate-x-0 sm:w-[400px]"
                        }
            ${!isSideBarOpen ? "hidden sm:block sm:translate-x-full" : ""}
          `}
                    aria-label="Course content"
                >
                    <div className="flex flex-col h-full">
                        <Tabs defaultValue="content" className="h-full flex flex-col">
                            <TabsList className="bg-[#0f1720] grid w-full grid-cols-2 p-0 h-12">
                                <TabsTrigger
                                    value="content"
                                    className="h-full rounded-none text-white  data-[state=active]:bg-white data-[state=active]:text-black"
                                >
                                    Course Content
                                </TabsTrigger>

                                <TabsTrigger
                                    value="overview"
                                    className="h-full rounded-none text-white data-[state=active]:bg-white data-[state=active]:text-black"
                                >
                                    Overview
                                </TabsTrigger>
                            </TabsList>


                            <TabsContent value="content" className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full">
                                    <div className="p-4 space-y-3">
                                        {(studentCurrentCourseProgress?.courseDetails?.curriculum || []).map((item) => (
                                            <div
                                                key={item._id}
                                                onClick={() => {
                                                    setCurrentLecture(item);
                                                    // if mobile, close drawer after selecting
                                                    if (isDrawerOpen) closeDrawer();
                                                }}
                                                className={`flex items-center gap-2 text-sm text-white font-medium cursor-pointer p-2 rounded-md hover:bg-white/5
                          ${currentLecture?._id === item._id ? "bg-white/5" : ""}
                        `}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => e.key === "Enter" && setCurrentLecture(item)}
                                                aria-current={currentLecture?._id === item._id}
                                            >
                                                {viewedSet.has(item._id) ? (
                                                    <Check className="h-4 w-4 text-green-400" />
                                                ) : (
                                                    <Play className="h-4 w-4" />
                                                )}

                                                <div className="flex-1">
                                                    <div className="truncate">{item.title}</div>
                                                    {item.duration && <div className="text-xs text-gray-400">{item.duration}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </TabsContent>

                            <TabsContent value="overview" className="flex-1 overflow-hidden">
                                <ScrollArea className="h-full">
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold mb-3">About this course</h2>
                                        <p className="text-gray-400">
                                            {studentCurrentCourseProgress?.courseDetails?.description}
                                        </p>
                                    </div>
                                </ScrollArea>
                            </TabsContent>
                        </Tabs>
                    </div>
                </aside>
            </div>

            {/* Not purchased dialog */}
            <Dialog open={isPurchasedCourses}>
                <DialogContent className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>You can't view this page</DialogTitle>
                        <DialogDescription>Please purchase this course to get access</DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Course complete dialog */}
            <Dialog open={showCourseCompleteDialog}>
                <DialogContent showOverlay={false} className="sm:w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Congratulations!</DialogTitle>
                        <DialogDescription className="flex flex-col gap-3">
                            <Label>You have completed the course</Label>
                            <div className="flex flex-row gap-3">
                                <Button onClick={() => navigate("/my-courses")}>My Courses Page</Button>
                                <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}









// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import VideoPlayer from "@/components/VideoPlayer"
// import { useAuthContext } from "@/contexts/AuthContext"
// import { currentCourseProgress, markLectureAsViewed, resetCourseProgress } from "@/services/courseProgressService"
// import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react"
// import { useEffect, useState } from "react"
// import ReactConfetti from "react-confetti"
// import { useNavigate, useParams } from "react-router-dom"

// const CourseProgress = () => {
//     const [isPurchasedCourses, setIsPurchasedCourses] = useState(false);
//     const [currentLecture, setCurrentLecture] = useState()
//     const [studentCurrentCourseProgress, setStudentCurrentCourseProgress] = useState({})
//     const [isSideBarOpen, setIsSideBarOpen] = useState(true)
//     const [showConfetti, setShowConfetti] = useState(false);
//     const [showCourseCompleteDialog, setShowCourseCompleteDialog] = useState(false);

//     const { courseId } = useParams()
//     const { user } = useAuthContext()
//     const navigate = useNavigate()

//     const fetchCurrentCourseProgress = async () => {
//         const response = await currentCourseProgress(user?._id, courseId)
//         if (response?.data?.success) {
//             if (!response?.data?.data?.isPurchased) {
//                 setIsPurchasedCourses(response?.data?.data?.isPurchased)
//             } else {
//                 setStudentCurrentCourseProgress({
//                     courseDetails: response.data?.data?.courseDetails,
//                     progress: response.data?.data?.progress
//                 })

//                 if (response.data?.data?.completed) {
//                     setCurrentLecture(response?.data?.data?.courseDetails?.curriculum[0])
//                     setShowCourseCompleteDialog(true);
//                     setShowConfetti(true);
//                     return
//                 }

//                 if (response?.data?.data?.progress?.length === 0) {
//                     setCurrentLecture(response?.data?.data?.courseDetails?.curriculum[0]);
//                 } else {
//                     const lastIndexOfViewedAsTrue = response?.data?.data?.progress.reduceRight(
//                         (acc, obj, index) => {
//                             return acc === -1 && obj.viewed ? index : acc;
//                         },
//                         -1
//                     );

//                     setCurrentLecture(
//                         response?.data?.data?.courseDetails?.curriculum[
//                         lastIndexOfViewedAsTrue + 1
//                         ]
//                     );
//                 }
//             }
//         }
//     }

//     const handleRewatchCourse = async () => {
//         const response = await resetCourseProgress(
//             user?._id,
//             studentCurrentCourseProgress?.courseDetails?._id
//         );

//         if (response?.data?.success) {
//             setCurrentLecture(null);
//             setShowConfetti(false);
//             setShowCourseCompleteDialog(false);
//             fetchCurrentCourseProgress();
//         }
//     }

//     async function updateCourseProgress() {
//         if (currentLecture) {
//             const response = await markLectureAsViewed(
//                 user?._id,
//                 studentCurrentCourseProgress?.courseDetails?._id,
//                 currentLecture._id
//             );

//             if (response?.data?.success) {
//                 fetchCurrentCourseProgress();
//             }
//         }
//     }

//     useEffect(() => {
//         if (currentLecture?.progressValue === 1) updateCourseProgress();
//     }, [currentLecture]);

//     useEffect(() => {
//         if (courseId) {
//             fetchCurrentCourseProgress()
//         }
//     }, [courseId])

//     useEffect(() => {
//         if (showConfetti) {
//             setTimeout(() => {
//                 setShowConfetti(false)
//             }, 7000)
//         }
//     }, [showConfetti])

//     return (
//         <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
//             {showConfetti && <ReactConfetti />}
//             <div className="flex items-center justify-between h-14 bg-[#1c1d1f] border-b border-gray-700">
//                 <div className="flex items-center space-x-4">
//                     <Button
//                         onClick={() => navigate("/my-courses")}
//                         className="border border-white"
//                         variant="ghost"
//                         size="sm"
//                     >
//                         <ChevronLeft className="h-4 w-4 mr-2" />
//                         Back to My Courses Page
//                     </Button>
//                     <h1 className="text-lg font-bold hidden md:block">
//                         {studentCurrentCourseProgress?.courseDetails?.title}
//                     </h1>
//                 </div>
//                 <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
//                     {isSideBarOpen ? (
//                         <ChevronRight className="h-5 w-5" />
//                     ) : (
//                         <ChevronLeft className="h-5 w-5" />
//                     )}
//                 </Button>
//             </div>
//             <div className="flex flex-1 overflow-hidden">
//                 <div
//                     className={`flex-1 ${isSideBarOpen ? "mr-[400px]" : ""
//                         } transition-all duration-300`}
//                 >
//                     <VideoPlayer
//                         width="100%"
//                         height="500px"
//                         url={currentLecture?.videoUrl}
//                         onProgressUpdate={setCurrentLecture}
//                         progressData={currentLecture}
//                     />
//                     <div className="p-6 bg-[#1c1d1f]">
//                         <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
//                     </div>
//                 </div>
//                 <div
//                     className={`fixed top-16 right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${isSideBarOpen ? "translate-x-0" : "translate-x-full"
//                         }`}
//                 >
//                     <Tabs defaultValue="content" className="h-full flex flex-col">
//                         <TabsList className="grid w-full grid-cols-2 p-0 h-15">
//                             <TabsTrigger
//                                 value="content"
//                                 className="bg-black text-white rounded-none h-full"
//                             >
//                                 Course Content
//                             </TabsTrigger>
//                             <TabsTrigger
//                                 value="overview"
//                                 className="rounded-none h-full"
//                             >
//                                 Overview
//                             </TabsTrigger>
//                         </TabsList>
//                         <TabsContent value="content">
//                             <ScrollArea className="h-full">
//                                 <div className="p-4 space-y-4">
//                                     {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
//                                         (item) => (
//                                             <div
//                                                 className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
//                                                 key={item._id}
//                                             >
//                                                 {studentCurrentCourseProgress?.progress?.find(
//                                                     (progressItem) => progressItem.lectureId === item._id
//                                                 )?.viewed ? (
//                                                     <Check className="h-4 w-4 text-green-500" />
//                                                 ) : (
//                                                     <Play className="h-4 w-4 " />
//                                                 )}
//                                                 <span>{item?.title}</span>
//                                             </div>
//                                         )
//                                     )}
//                                 </div>
//                             </ScrollArea>
//                         </TabsContent>
//                         <TabsContent value="overview" className="flex-1 overflow-hidden">
//                             <ScrollArea className="h-full">
//                                 <div className="p-4">
//                                     <h2 className="text-xl font-bold mb-4">About this course</h2>
//                                     <p className="text-gray-400">
//                                         {studentCurrentCourseProgress?.courseDetails?.description}
//                                     </p>
//                                 </div>
//                             </ScrollArea>
//                         </TabsContent>
//                     </Tabs>
//                 </div>
//             </div>
//             <Dialog open={isPurchasedCourses}>
//                 <DialogContent className="sm:w-[425px]">
//                     <DialogHeader>
//                         <DialogTitle>You can't view this page</DialogTitle>
//                         <DialogDescription>
//                             Please purchase this course to get access
//                         </DialogDescription>
//                     </DialogHeader>
//                 </DialogContent>
//             </Dialog>
//             <Dialog open={showCourseCompleteDialog}>
//                 <DialogContent showOverlay={false} className="sm:w-[425px]">
//                     <DialogHeader>
//                         <DialogTitle>Congratulations!</DialogTitle>
//                         <DialogDescription className="flex flex-col gap-3">
//                             <Label>You have completed the course</Label>
//                             <div className="flex flex-row gap-3">
//                                 <Button onClick={() => navigate("/my-courses")}>
//                                     My Courses Page
//                                 </Button>
//                                 <Button onClick={handleRewatchCourse}>Rewatch Course</Button>
//                             </div>
//                         </DialogDescription>
//                     </DialogHeader>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }

// export default CourseProgress