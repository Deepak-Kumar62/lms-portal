import axiosInstance from "@/axiosInstance";

export const createCourse = async (formData) => {
  return await axiosInstance.post(`/instructor/course`, formData);
};

export const updateCourse = async (courseId, formData) => {
  return await axiosInstance.put(`/instructor/course/${courseId}`, formData);
};

export const fetchInstructorCourseDetails = async (courseId) => {
  return await axiosInstance.get(`/instructor/course/${courseId}`);
};

export const fetchAllInstructorCourses = async () => {
  return await axiosInstance.get(`/instructor/course`);
};
