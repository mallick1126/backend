import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      `DB connected successfully! DB host:`,
      connectionInstance.connection.host
    );
  } catch (error) {
    console.error(`Error connecting to the DB! err:`, error);
    process.exit(1);
  }
};

export default connectDB;