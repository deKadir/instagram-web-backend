import mongoose from "mongoose";
const { Schema } = mongoose;

const MessageSchema = new Schema(
  {
    roomId: {
      type: mongoose.Types.ObjectId,
      required: [true, "roomId cannot be empty"],
      ref: "Room",
    },
    sender: {
      type: mongoose.Types.ObjectId,
      required: [true, "message sender cannot be empty"],
      ref: "User",
    },
    text: {
      type: String,
      required: [true, "message body cannot be empty"],
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
export default mongoose.model("Message", MessageSchema);
