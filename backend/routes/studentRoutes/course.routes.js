import express from "express";
import {
  getCourseDetails,
  getCoursesForStudent,
} from "../../controllers/studentControllers/course.controller.js";

const router = express.Router();

router.get("/", getCoursesForStudent);
router.get("/:courseId", getCourseDetails);

export default router;
