import jwt from "jsonwebtoken";
import asyncErrorWrapper from "express-async-error-wrapper";
import User from "../../models/User";
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
  await User.findOne({ id: userId })
    .populate("followers")
    .then((user) => {
      if (
        user.followers.includes(currentUser) ||
        !user.privateStatus ||
        userId === currentUser
      ) {
        next();
      } else {
        res.status(403).json({
          error: true,
          message: "you have no access to view this page",
        });
      }
    });
});
