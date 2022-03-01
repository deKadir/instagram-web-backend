import mongoose from "mongoose";

const { Schema } = mongoose;

const FollowSchema = new Schema({
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Follow", FollowSchema);
