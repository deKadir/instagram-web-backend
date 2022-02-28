import Post from "../models/Post.js";
import User from "../models/User.js";
import asyncErrorWrapper from "express-async-error-wrapper";

export const addPost = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const { description } = req.body;
  const photos = req.files.map((photo) => photo.filename);

  await Post.create({ userId, description, photos })
    .then(() => {
      res.json({
        error: false,
        message: "post uploaded successfully",
      });
    })
    .catch((e) => next(new Error("error" + e.message)));
});
export const getPost = asyncErrorWrapper(async (req, res, next) => {
  await Post.findById(req.params.id)
    .then((post) =>
      res.json({
        error: false,
        data: post,
      })
    )
    .catch((res) => next(new Error("Post not found")));
});
export const getUserPosts = asyncErrorWrapper(async (req, res, next) => {
  await Post.find({ userId: req.params.userId })
    .select("likes photos ")
    .then((posts) => {
      res.json({
        error: false,
        data: posts,
      });
    })
    .catch(() => next(new Error("Post not found")));
});
export const postFeed = asyncErrorWrapper(async (req, res, next) => {
  const activeUserId = req.user.id;
  const followings = await User.findById(activeUserId).populate(
    "following",
    "_id"
  );

  const posts = await Post.find({ userId: { $in: [followings] } }).populate(
    "userId",
    "username profileImg"
  );

  res.json({
    error: false,
    message: "success",
    data: posts,
  });
});
export const likePost = asyncErrorWrapper(async (req, res, next) => {});
export const deletePost = asyncErrorWrapper(async (req, res, next) => {});
