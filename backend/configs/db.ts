import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {});
    console.log("MONGO connected");
  } catch (error) {
    console.log("Error connecting mongo");
    process.exit(1);
  }
};
