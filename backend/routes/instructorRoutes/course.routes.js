import express from "express";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
} from "../../controllers/instructorControllers/course.controller.js";

const router = express.Router();

router.post("/", verifyAuth, createCourse);
router.get("/", verifyAuth, getAllCourses);
router.get("/:courseId", verifyAuth, getCourse);
router.put("/:courseId", verifyAuth, updateCourse);

export default router;
