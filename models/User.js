import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field cannot be empty"],
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  username: {
    type: String,
    required: [true, "username field cannot be empty"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password field cannot be empty"],
  },
});
export default mongoose.model("User", UserSchema);
