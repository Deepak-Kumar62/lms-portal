import axiosInstance from "@/axiosInstance";

export const currentCourseProgress = async (userId, courseId) => {
  return await axiosInstance.get(
    `/student/course-progress/${userId}/${courseId}`
  );

  return data;
};

export const markLectureAsViewed = async (userId, courseId, lectureId) => {
  return await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
};

export const resetCourseProgress = async (userId, courseId) => {
  return await axiosInstance.post(`/student/course-progress/reset-progress`, {
    userId,
    courseId,
  });

  return data;
};
