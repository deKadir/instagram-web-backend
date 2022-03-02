import mongoose from "mongoose";
const { Schema } = mongoose;
const FollowSchema = new Schema({
  following: {
    type: Schema.Types.ObjectId,
    required: [true, "following cannot be empty"],
    ref: "User",
  },
  follower: {
    type: Schema.Types.ObjectId,
    required: [true, "follower cannot be empty"],
    ref: "User",
  },
});
export default mongoose.model("Follow", FollowSchema);
