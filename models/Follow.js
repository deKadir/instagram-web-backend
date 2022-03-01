import mongoose from "mongoose";

const { Schema } = mongoose;

const FollowSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Follow", FollowSchema);
