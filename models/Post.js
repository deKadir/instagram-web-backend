import mongoose from "mongoose";
const { Schema } = mongoose;
const PostSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Post owner cannot be empty"],
      ref: "User",
    },
    photos: [
      {
        type: String,
        required: [true, "photos cannot be empty"],
      },
    ],
    description: {
      type: String,
      required: [true, "description cannot be empty"],
    },

    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Post", PostSchema);
