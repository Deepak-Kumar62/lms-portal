import express from "express";
import { verifyAuth } from "../../middlewares/auth.middleware.js";
import { getStudentCourses } from "../../controllers/studentControllers/studentCourse.controller.js";

const router = express.Router();

router.get("/:studentId", verifyAuth, getStudentCourses);

export default router;
