import Post from "../models/Post.js";
import asyncErrorWrapper from "express-async-error-wrapper";

import mongoose from "mongoose";

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
  const post = await Post.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "id",
        as: "likeCount",
      },
    },
    {
      $addFields: {
        likeCount: {
          $size: "$likeCount",
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "id",
        as: "liked",
      },
    },
    {
      $addFields: {
        liked: {
          $size: {
            $filter: {
              input: "$liked",
              as: "l",
              cond: {
                $eq: ["$$l.user", mongoose.Types.ObjectId(req.user.id)],
              },
            },
          },
        },
      },
    },
  ]);

  await Post.populate(post, { path: "userId", select: "username profileImg" });
  res.json({
    error: false,
    data: post[0],
  });
});
export const getUserPosts = asyncErrorWrapper(async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const startIndex = (page - 1) * limit;
  // const endIndex = page * limit;
  const posts = await Post.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(req.params.userId) } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "id",
        as: "posts",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$posts" },
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $addFields: {
        commentCount: {
          $size: "$comments",
        },
      },
    },
    {
      $skip: startIndex,
    },
    { $limit: Number(limit) },
    {
      $project: {
        photos: 1,
        likeCount: 1,
        commentCount: 1,
      },
    },
  ]);
  res.json({
    error: false,
    data: posts,
    next: page + 1,
  });
});
export const postFeed = asyncErrorWrapper(async (req, res, next) => {
  const activeUserId = req.user.id;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  var startIndex = Number(parseInt(page) - 1) * Number(limit);
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: "follows",
        localField: "userId",
        foreignField: "following",
        as: "relationship",
      },
    },
    {
      $match: {
        $or: [
          { "relationship.follower": mongoose.Types.ObjectId(activeUserId) },
          { userId: mongoose.Types.ObjectId(activeUserId) },
        ],
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "id",
        as: "likeCount",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "commentCount",
      },
    },

    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "id",
        as: "liked",
      },
    },
    {
      $addFields: {
        liked: {
          $size: {
            $filter: {
              input: "$liked",
              as: "l",
              cond: {
                $eq: ["$$l.user", mongoose.Types.ObjectId(activeUserId)],
              },
            },
          },
        },
      },
    },
    { $addFields: { commentCount: { $size: "$commentCount" } } },
    { $addFields: { likeCount: { $size: "$likeCount" } } },
    { $sort: { createdAt: -1 } },
    { $skip: startIndex },
    { $limit: limit },
    { $unset: "relationship" },
  ]);

  await Post.populate(posts, {
    path: "userId",
    select: "username profileImg ",
  });

  res.json({
    error: false,
    message: "success",
    data: posts,
  });
});

export const explorePosts = asyncErrorWrapper(async (req, res, next) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  var startIndex = Number(parseInt(page) - 1) * Number(limit);
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "id",
        as: "likeCount",
      },
    },
    {
      $addFields: { likeCount: { $size: "$likeCount" } },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "postId",
        as: "comments",
      },
    },
    {
      $addFields: { commentCount: { $size: "$comments" } },
    },
    { $skip: startIndex },
    { $limit: limit },
    {
      $project: {
        photos: 1,
        likeCount: 1,
        commentCount: 1,
      },
    },
  ]);
  res.json({
    error: false,
    posts,
  });
});

export const likePost = asyncErrorWrapper(async (req, res, next) => {});
export const deletePost = asyncErrorWrapper(async (req, res, next) => {});
