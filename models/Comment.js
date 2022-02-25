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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
