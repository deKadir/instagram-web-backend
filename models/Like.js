import mongoose from "mongoose";
const { Schema } = mongoose;

const LikeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
