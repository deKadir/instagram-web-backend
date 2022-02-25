import jwt from "jsonwebtoken";
import asyncErrorWrapper from "express-async-error-wrapper";

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
