import Course from "../../models/course.model.js";
import CourseProgress from "../../models/courseProgress.model.js";
import StudentCourses from "../../models/studentCourse.model.js";

export const getCurrentCourseProgress = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.params;

    const studentPurchasedCourse = await StudentCourses.findOne({
      userId: studentId,
    });

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course does not exist",
      });
    }

    if (!studentPurchasedCourse) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const isCoursePurchased =
      studentPurchasedCourse.courses.findIndex(
        (course) => course.courseId === courseId
      ) > -1;

    if (!isCoursePurchased) {
      return res.status(400).json({
        success: true,
        message: "Course is not bought",
        data: false,
      });
    }

    const currentCourseProgress = await CourseProgress.findOne({
      userId: studentId,
      courseId,
    });

    if (!currentCourseProgress) {
      return res.status(200).json({
        success: true,
        message: "No progress found, you can start watching the course",
        data: {
          courseDetails: course,
          progress: [],
          isPurchased: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "progress found, you can start watching the course",
      data: {
        courseDetails: course,
        progress: currentCourseProgress.lecturesProgress,
        completed: currentCourseProgress.completed,
        completionDate: currentCourseProgress.completedDate,
        isPurchased: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const markCurrentLectureViewd = async (req, res, next) => {
  try {
    const { userId, courseId, lectureId } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Current course not found",
      });
    }

    const courseProgress = await CourseProgress.findOne({
      userId,
      courseId,
    });

    if (!courseProgress) {
      const courseProgress = new CourseProgress({
        userId,
        courseId,
        lecturesProgress: [
          { lectureId: lectureId, viewed: true, dateViewed: new Date() },
        ],
      });

      await courseProgress.save();
    } else {
      const lecture = courseProgress?.lecturesProgress?.find(
        (lec) => lec.lectureId === lectureId
      );

      if (lecture) {
        (lecture.viewed = true), (lecture.dateViewed = new Date());
      } else {
        courseProgress?.lecturesProgress?.push({
          lectureId: lectureId,
          viewed: true,
          dateViewed: new Date(),
        });
      }

      await courseProgress.save();
    }

    // check all lecture viewed or not
    const isAllLectureViewed =
      course?.curriculum?.length === courseProgress?.lecturesProgress?.length &&
      courseProgress?.lecturesProgress?.every((lecture) => lecture.viewed);

    if (isAllLectureViewed) {
      (courseProgress.completed = true),
        (courseProgress.completedDate = new Date());
      await courseProgress.save();
    }

    return res.status(200).json({
      success: true,
      message: "Lecture marked as viewed",
      data: courseProgress,
    });
  } catch (error) {
    next(error);
  }
};

export const resetCurrentCourseProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const progress = await CourseProgress.findOne({ userId, courseId });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found!",
      });
    }

    progress.lecturesProgress = [];
    progress.completed = false;
    progress.completedDate = null;

    await progress.save();

    res.status(200).json({
      success: true,
      message: "Course progress has been reset",
      data: progress,
    });
  } catch (error) {
    next(error);
  }
};
