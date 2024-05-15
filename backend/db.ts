import mongoose from "npm:mongoose";

export async function connectDatabase(MONGO_URI: string) {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully!");
  } catch (e) {
    console.error(`MongoDB connection error\n${e}`);
    Deno.exit(1);
  }
}
