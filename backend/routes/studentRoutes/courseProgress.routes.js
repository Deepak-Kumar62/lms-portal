import express from "express";
import {
  getCurrentCourseProgress,
  markCurrentLectureViewd,
  resetCurrentCourseProgress,
} from "../../controllers/studentControllers/courseProgress.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:studentId/:courseId", verifyAuth, getCurrentCourseProgress);
router.post("/mark-lecture-viewed", verifyAuth, markCurrentLectureViewd);
router.post("/reset-progress", verifyAuth, resetCurrentCourseProgress);

export default router;
