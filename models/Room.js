import mongoose from "mongoose";
const { Schema } = mongoose;

const RoomSchema = new Schema({
  users: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
});

export default mongoose.model("Room", RoomSchema);
