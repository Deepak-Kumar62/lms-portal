import StudentCourses from "../../models/studentCourse.model.js";

export const getStudentCourses = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const studentBoughtCourses = await StudentCourses.findOne({
      userId: studentId,
    });

    if (!studentBoughtCourses) {
      return res.status(400).json({
        success: false,
        message: "Courses not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Courses found successfully",
      data: studentBoughtCourses.courses,
    });
  } catch (error) {
    next(error);
  }
};
