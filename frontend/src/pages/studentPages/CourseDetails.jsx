import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VideoPlayer from '@/components/VideoPlayer';
import { useAuthContext } from '@/contexts/AuthContext';
import { createOrder } from '@/services/orderService';
import { fetchCourseDetails } from '@/services/stdentService';
import { CheckCircle, Globe, Lock, PlayCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CourseDetails = () => {
  const [studentViewCourseDetails, setStudentViewCourseDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false)
  const [currentFreePreviewVideoUrl, setCurrentFreePreviewVideoUrl] = useState(null)
  const [approvalUrl, setApprovalUrl] = useState(null)

  const { user } = useAuthContext()
  const { courseId } = useParams()
  const navigate = useNavigate()

  if (approvalUrl !== null) {
    window.location.href = approvalUrl;
  }

  const indexOfFreePreviewUrl = studentViewCourseDetails ?
    (studentViewCourseDetails?.curriculum?.findIndex((curriculumVideo) => curriculumVideo.freePreview))
    : -1

  const handleFetchCourse = async () => {
    try {
      setLoading(true)
      const response = await fetchCourseDetails(courseId)
      if (response?.data?.success) {
        setStudentViewCourseDetails(response?.data?.data)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      setStudentViewCourseDetails({})
    }
  }

  const handleSetFreePreview = (curriculumVideo) => {
    if (curriculumVideo) {
      setCurrentFreePreviewVideoUrl(curriculumVideo.videoUrl)
      setShowFreePreviewDialog(true)
    }
  }

  const handleCreateOrder = async () => {

    if (!user) {
      return navigate("/auth")
    }

    try {
      const orderPayload = {
        userId: user?._id,
        userName: user?.userName,
        userEmail: user?.userEmail,
        orderStatus: "pending",
        paymentMethod: "paypal",
        paymentStatus: "initiated",
        orderDate: new Date(),
        paymentId: "",
        payerId: "",
        instructorId: studentViewCourseDetails?.instructorId,
        instructorName: studentViewCourseDetails?.instructorName,
        courseImage: studentViewCourseDetails?.image,
        courseTitle: studentViewCourseDetails?.title,
        courseId: studentViewCourseDetails?._id,
        coursePricing: studentViewCourseDetails?.pricing,
      };


      const response = await createOrder(orderPayload)

      if (response?.data?.success) {
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(response?.data?.data?.orderId)
        );
        setApprovalUrl(response?.data?.data?.approveUrl);
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }



  useEffect(() => {
    if (courseId) {
      handleFetchCourse()
    }
  }, [courseId])



  if (loading) {
    return <div className='text-2xl text-center p-5'>Loading....</div>
  }

  if (Object.keys(studentViewCourseDetails).length === 0) {
    return <div className='text-2xl p-5 min-h-screen flex items-center justify-center'>Course details not found 🙏</div>
  }

  return (
    <div className=" mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By {studentViewCourseDetails?.instructorName}</span>
          <span>Created On {studentViewCourseDetails?.date?.split("T")[0]}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students?.length}{" "}
            {studentViewCourseDetails?.students?.length <= 1
              ? "Student"
              : "Students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        <main className="grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  ?.split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentViewCourseDetails?.description}</CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetails?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    key={curriculumItem._id}
                    className={`${curriculumItem?.freePreview
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                      } flex items-center mb-4`}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full lg:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    indexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[
                        indexOfFreePreviewUrl
                      ].videoUrl
                      : null
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  ${studentViewCourseDetails?.pricing}
                </span>
              </div>
              <Button
                onClick={handleCreateOrder}
                className="w-full cursor-pointer">
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setCurrentFreePreviewVideoUrl(null)
        }}
      >
        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={currentFreePreviewVideoUrl}
              width="450px"
              height="200px"
            />
          </div>
          <div className="flex flex-col gap-2">
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <p
                  key={index}
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="cursor-pointer text-[16px] font-medium"
                >
                  {filteredItem?.title}
                </p>
              ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CourseDetails