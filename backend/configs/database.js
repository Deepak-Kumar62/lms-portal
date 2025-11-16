import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      throw new Error("MONGO_URI not found in environment variables");
    }

    await mongoose.connect(MONGO_URI);
    console.log("Database Connected Successfully");

  } catch (error) {
    console.log("Databse connection failed: ", error);
    process.exit(1);
  }
};
