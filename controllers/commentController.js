import asyncErrorWrapper from "express-async-error-wrapper";
import Comment from "../models/Comment.js";
export const addComment = asyncErrorWrapper(async (req, res, next) => {
  const { comment, postId } = req.body;
  const owner = req.user.id;
  const createdComment = await Comment.create({ owner, comment, postId }).catch(
    (error) => next(new Error(error.message))
  );

  res.status(200).json({
    error: false,
    message: "commented",
    comment: createdComment,
  });
});

export const getPostComments = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;

  await Comment.find({ postId: id })
    .populate("owner", "username profileImg verified")
    .sort({ createdAt: -1 })
    .then((comments) => res.json({ error: false, comments }))
    .catch(() => next(new Error("post not found")));
});
