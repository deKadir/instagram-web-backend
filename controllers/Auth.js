import User from "../models/User";
import asyncErrorWrapper from "express-async-error-wrapper";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validateEmail } from "../helpers/validate";

export const login = asyncErrorWrapper(async (req, res, next) => {
  const loginReq = req.body;
  let query;
  if (validateEmail(loginReq.username)) {
    query = { email: loginReq.username };
  } else {
    query = { username: loginReq.username };
  }

  const user = await User.findOne(query).select("+password");
  if (!user) {
    return next(new Error("User not found"));
  }
  bcrypt.compare(loginReq.password, user.password, function (err, result) {
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
          error: true,
          message: "login failed, wrong password",
        });
      }
    }
  });
});

export const register = asyncErrorWrapper(async (req, res, next) => {
  const { email, username, password, name } = req.body;

  const user = await User.create({
    email,
    username,
    password,
    name,
  }).catch((error) => {
    return next(new Error(error.message, error.code));
  });

  let token = jwt.sign({ data: { id: user.id } }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.status(201).json({
    error: false,
    message: "registered successfully",
    token,
  });
});
