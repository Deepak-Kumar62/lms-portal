import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    orderStatus: {
      type: String,
      default: "pending",
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    paymentStatus: {
      type: String,
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    paymentId: {
      type: String,
      default: null,
    },

    payerId: {
      type: String,
      default: null,
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

    courseId: {
      type: String,
      required: true,
    },

    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },

    courseImage: {
      type: String,
      required: true,
    },

    coursePricing: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
