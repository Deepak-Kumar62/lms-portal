import axiosInstance from "@/axiosInstance";

export const mediaUpload = async (
  formdData,
  setMediaUploadProgressPercentage
) => {
  return await axiosInstance.post("/instructor/media/upload", formdData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setMediaUploadProgressPercentage(percentCompleted);
    },
  });
};

export const mediaDelete = async (public_id) => {
  return await axiosInstance.delete(`/instructor/media/delete/${public_id}`);
};

export const bulkMediaUpload = async (
  formData,
  setMediaUploadProgressPercentage
) => {
  return await axiosInstance.post("/instructor/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      setMediaUploadProgressPercentage(percentCompleted);
    },
  });
};
