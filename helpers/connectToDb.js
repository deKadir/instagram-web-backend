import mongoose from "mongoose";
export const connectToDb = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("database connection succeed."))
    .catch((err) => console.log(`Database connection failed: ${err.message}`));
};
