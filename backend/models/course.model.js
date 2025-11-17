import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    freePreview: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    studentEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const courseSchema = new mongoose.Schema(
  {
    instructorId: {
      type: String,
      required: true,
    },
    instructorName: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    primaryLanguage: {
      type: String,
      default: "English",
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
    },
    welcomeMessage: {
      type: String,
      trim: true,
    },
    pricing: {
      type: Number,
      required: true,
    },
    objectives: {
      type: String,
    },
    students: [studentSchema],
    curriculum: [lectureSchema],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
