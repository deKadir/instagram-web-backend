import Post from "../models/Post.js";
import User from "../models/User.js";
import asyncErrorWrapper from "express-async-error-wrapper";
import Follow from "../models/Follow.js";

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
    .populate("userId", "username profileImg")
    .then((post) =>
      res.json({
        error: false,
        data: post,
      })
    )
    .catch((res) => next(new Error("Post not found")));
});
export const getUserPosts = asyncErrorWrapper(async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  await Post.find({ userId: req.params.userId })
    .skip(startIndex)
    .limit(limit)
    .select("likes photos ")
    .then((posts) => {
      res.json({
        error: false,
        data: posts,
        next: page + 1,
      });
    })
    .catch(() => next(new Error("Post not found")));
});
export const postFeed = asyncErrorWrapper(async (req, res, next) => {
  const activeUserId = req.user.id;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  var startIndex = Number(parseInt(page) - 1) * Number(limit);
  var endIndex = Number(page) * Number(limit);
  const followings = await Follow.find({ follower: activeUserId }).select(
    "followings._id"
  );
  console.log(followings);
  const posts = await Post.find({ userId: { $in: followings } })
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .populate("userId", "username profileImg");

  res.json({
    error: false,
    message: "success",
    data: posts,
  });
});
export const likePost = asyncErrorWrapper(async (req, res, next) => {});
export const deletePost = asyncErrorWrapper(async (req, res, next) => {});
