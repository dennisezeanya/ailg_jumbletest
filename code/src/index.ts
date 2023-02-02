import "dotenv/config";
import mongoose from "mongoose";
import { newApp } from "./app";

async function run() {
  const app = newApp();
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.DATABASE_URL!);

  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

run();
