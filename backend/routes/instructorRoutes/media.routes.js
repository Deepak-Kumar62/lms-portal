import express from "express";
import upload from "../../middlewares/multer.middleware.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import {
  bulkUploadMediaToCloudinary,
  deleteMediaFromCloudinary,
  uploadMediaToCloudinary,
} from "../../controllers/instructorControllers/media.controller.js";

const router = express.Router();

router.post(
  "/upload",
  verifyAuth,
  upload.single("file"),
  uploadMediaToCloudinary
);

router.post(
  "/bulk-upload",
  verifyAuth,
  upload.array("files", 10),
  bulkUploadMediaToCloudinary
);

router.delete("/delete/:publicId", verifyAuth, deleteMediaFromCloudinary);

export default router;
