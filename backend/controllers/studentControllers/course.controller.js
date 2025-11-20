import Course from "../../models/course.model.js";
import StudentCourses from "../../models/studentCourse.model.js";

export const getCoursesForStudent = async (req, res, next) => {
  try {
    const {
      category = [],
      level = [],
      primaryLanguage = [],
      sortBy = "price-lowtohigh",
    } = req.query;

    const filters = {};

    if (category.length) {
      filters.category = { $in: category };
    }

    if (level.length) {
      filters.level = { $in: level };
    }
    if (primaryLanguage.length) {
      filters.primaryLanguage = { $in: primaryLanguage };
    }

    const sortParam = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sortParam.pricing = 1;
        break;

      case "price-hightolow":
        sortParam.pricing = -1;
        break;

      case "title-ztoa":
        sortParam.title = -1;
        break;

      default:
        sortParam.pricing = 1;
        break;
    }

    const coursesList = await Course.find(filters).sort(sortParam);

    if (!coursesList) {
      return res.status(400).json({
        success: false,
        message: "Course List not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course List found successfully.",
      data: coursesList,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourseDetails = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course  found successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const checkCourseBought = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.params;

    const studentCourses = await StudentCourses.findOne({ userId: studentId });

    if (!studentCourses) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const isCourseBought =
      studentCourses?.courses.findIndex(
        (course) => course.courseId === courseId
      ) > -1;

    if (isCourseBought) {
      return res.status(200).json({
        success: true,
        message: "Student has bought the course",
        data: isCourseBought,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student has not bought the course",
      data: false,
    });
  } catch (error) {
    next(error);
  }
};
