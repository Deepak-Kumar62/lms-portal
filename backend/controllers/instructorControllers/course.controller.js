import Course from "../../models/course.model.js";

export const createCourse = async (req, res, next) => {
  try {
    const courseData = req.body;

    const course = await Course.create(courseData);

    return res.status(200).json({
      success: true,
      message: "Course created successfully.",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const courseData = req.body;

    const updatedCourse = await Course.findByIdAndUpdate(courseId, courseData, {
      new: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course found successfully",
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();

    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "Courses not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Courses found successfully",
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};
