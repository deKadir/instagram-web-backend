import jwt from "jsonwebtoken";
import asyncErrorWrapper from "express-async-error-wrapper";
import Room from "../../models/Room.js";

export const loginCheck = asyncErrorWrapper(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      next(new Error(`token error: ${err.message}`));
    } else {
      req.user = { id: decoded.data.id };
      next();
    }
  });
});

export const accessUserDetails = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const currentUser = req.user.id;
  next(); // await Follow.findOne({ follower: currentUser, following: userId })
  //   .then(() => next())
  //   .catch(() => {
  //     res.status(200).json({
  //       error: true,
  //       message: "you have no access to view this page",
  //     });
  //   });
});
export const accessMessages = asyncErrorWrapper(async (req, res, next) => {
  const room = await Room.findOne({
    users: { $in: req.user.id },
    _id: req.query.room,
  });

  if (room) {
    next();
  } else {
    return next(new Error("you have no access to view this room"));
  }
});
