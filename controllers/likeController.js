import asyncErrorWrapper from "express-async-error-wrapper";
import Like from "../models/Like";

export const likeComment = asyncErrorWrapper(async (req, res, next) => {
  const { commentId } = req.params;
  const user = req.user.id;
  const like = await Like.findOne({ user, id: commentId });
  if (like) {
    like.remove();
    like.save();
    res.status(200).json({
      error: false,
      message: "unlike",
    });
  } else {
    await Like.create({ user, type: "Comment", id: commentId }).then((like) =>
      res.status(200).json({
        error: false,
        message: "like",
        like,
      })
    );
  }
});
export const likePost = asyncErrorWrapper(async (req, res, next) => {
  const { postId } = req.params;
  const user = req.user.id;
  const like = await Like.findOne({ user, id: postId });
  if (like) {
    like.remove();
    like.save();
    res.status(200).json({
      error: false,
      message: "unlike",
    });
  } else {
    await Like.create({ user, type: "Post", id: postId }).then((like) =>
      res.status(200).json({
        error: false,
        message: "like",
        like,
      })
    );
  }
});
export const getPostLikes = asyncErrorWrapper(async (req, res, next) => {});
export const getCommentLikes = asyncErrorWrapper(async (req, res, next) => {});
