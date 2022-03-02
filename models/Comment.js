import mongoose from "mongoose";
const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Comment owner cannot be empty"],
      ref: "User",
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
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
