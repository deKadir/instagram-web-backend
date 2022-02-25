import mongoose from "mongoose";
const { Schema } = mongoose;
const PostSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Post owner cannot be empty"],
    },
    post: {
      type: String,
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId }],
  },
  { timestamps: true }
);
export default mongoose.model("Post", PostSchema);
