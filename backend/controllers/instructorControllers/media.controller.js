import cloudinary from "../../configs/cloudinary.js";
import fs from "fs"; // <-- needed for deleting temp files

export const uploadMediaToCloudinary = async (req, res, next) => {
  try {
    const localPath = req.file.path;

    const result = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });

    // DELETE TEMP FILE
    fs.unlinkSync(localPath);

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
        message: "Resource publicId is required",
      });
    }

    await cloudinary.uploader.destroy(publicId);

    return res.status(200).json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const bulkUploadMediaToCloudinary = async (req, res, next) => {
  try {
    const allPromises = req.files.map(async (fileItem) => {
      const uploadResult = await cloudinary.uploader.upload(fileItem.path, {
        resource_type: "auto",
      });

      // DELETE EACH TEMP FILE
      fs.unlinkSync(fileItem.path);

      return uploadResult;
    });

    const results = await Promise.all(allPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
