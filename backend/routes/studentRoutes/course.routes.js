import express from "express";
import {
  checkCourseBought,
  getCourseDetails,
  getCoursesForStudent,
} from "../../controllers/studentControllers/course.controller.js";
import { verifyAuth } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getCoursesForStudent);
router.get("/:courseId", getCourseDetails);
router.get(
  "/purchase-info/:studentId/:courseId",
  verifyAuth,
  checkCourseBought
);

export default router;
