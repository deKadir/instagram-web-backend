import mongoose from "mongoose";
const { Schema } = mongoose;

const LikeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  id: {
    type: Schema.Types.ObjectId,
    refPath: "type",
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Post", "Comment"],
  },
});
export default mongoose.model("Like", LikeSchema);
