import axiosInstance from "@/axiosInstance";

export const fetchStudentBoughtCourses = async (studentId) => {
  return await axiosInstance.get(`/student/bought-course/${studentId}`);
};
