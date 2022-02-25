import User from "../models/User";
import asyncErrorWrapper from "express-async-error-wrapper";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const login = asyncErrorWrapper(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");
  if (!user) {
    next(new Error("User not found"));
  }
  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      next(new Error(err.message));
    } else {
      if (result) {
        let token = jwt.sign(
          { data: { id: user.id } },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRE,
          }
        );
        res.status(200).json({
          error: false,
          message: "login succeed",
          token,
        });
      } else {
        res.status(400).json({
          error: false,
          message: "login failed, wrong password",
        });
      }
    }
  });
});

export const register = asyncErrorWrapper(async (req, res, next) => {
  const { email, phone, username, password, name } = req.body;
  if (!email && !phone) {
    next(new Error("please provide email or phone number"));
  } else {
    const user = await User.create({
      email,
      phone,
      username,
      password,
      name,
    }).catch((error) => {
      next(new Error(error.message, error.code));
    });
    let token = jwt.sign({ data: { id: user.id } }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    res.status(201).json({
      error: false,
      message: "registered successfully",
      token,
    });
  }
});
