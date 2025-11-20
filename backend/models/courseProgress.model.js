import mongoose from "mongoose";

const lectureProgressSchema = new mongoose.Schema(
  {
    lectureId: {
      type: String,
      required: true,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    dateViewed: {
      type: Date,
    },
  },
  { _id: false }
);

const courseProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courseId: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedDate: {
      type: Date,
    },
    lecturesProgress: {
      type: [lectureProgressSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema);

export default CourseProgress;
