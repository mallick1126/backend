import dotenv from "dotenv";
import connectDB from "./db/connection.js";
import { app } from "./app.js";
const PORT = process.env.PORT || 8080;
dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error("Server error:", err.message);
    });

    app.listen(PORT || 8080, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((dbError) => {
    console.error(`Database connection failed, err: `, dbError);
  });
