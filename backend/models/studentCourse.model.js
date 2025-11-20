import mongoose from "mongoose";

const courseItemSchema = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    instructorId: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfPurchase: {
      type: Date,
      default: Date.now,
    },
    courseImage: {
      type: String,
      required: true,
    },
  },
  { _id: false } // prevents creating _id for each course item
);

const studentCoursesSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courses: {
      type: [courseItemSchema],
      default: [],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

const StudentCourses = mongoose.model("StudentCourses", studentCoursesSchema);

export default StudentCourses;
