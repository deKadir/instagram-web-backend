import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name field cannot be empty"],
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
  },
  username: {
    type: String,
    required: [true, "username field cannot be empty"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "password field cannot be empty"],
    select: false,
  },
});
UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) next(err);
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});
export default mongoose.model("User", UserSchema);
