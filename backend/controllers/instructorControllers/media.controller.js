import cloudinary from "../../configs/cloudinary.js";
import { Promise } from "mongoose";

export const uploadMediaToCloudinary = async (req, res, next) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: auto,
    });

    return res.status(200).json({
      success: true,
      message: "Media uploaded successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMediaFromCloudinary = async (req, res, next) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(404).json({
        success: false,
        message: "Resource publicId id required",
      });
    }
    await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({
      success: true,
      message: "Media is deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const bulkUploadMediaToCloudinary = async (req, res, next) => {
  try {
    const allPromises = req.files.map(
      async (fileItem) => await cloudinary.uploader.upload(fileItem.path)
    );

    const results = await Promise.all(allPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
