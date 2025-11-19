import axiosInstance from "@/axiosInstance";

export const fetchAllCoursesForStudent = async (query) => {
  return await axiosInstance.get(`/student/course?${query}`);
};

export const fetchCourseDetails = async (courseId) => {
  return await axiosInstance.get(`/student/course/${courseId}`);
};

export const fetchByedCoursesByStudent = async () => {};

export const fetchStudentCourseProgress = async () => {};
