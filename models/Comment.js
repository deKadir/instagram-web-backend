import mongoose from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Comment owner cannot be empty"],
    },
    comment: {
      type: String,
      required: [true, "comment cannot be empty"],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Comment post cannot be empty"],
      ref: "Post",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
