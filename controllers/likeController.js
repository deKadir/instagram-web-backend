import asyncErrorWrapper from "express-async-error-wrapper";
import Like from "../models/Like";
import mongoose from "mongoose";
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
  const like = await Like.findOne({ user, id: postId }).catch(() => {});
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
export const getPostLikes = asyncErrorWrapper(async (req, res, next) => {
  const likes = await Like.aggregate([
    { $match: { id: mongoose.Types.ObjectId(req.params.postId) } },
    {
      $lookup: {
        from: "follows",
        localField: "user",
        foreignField: "following",
        as: "isFollowing",
      },
    },
    {
      $addFields: {
        isFollowing: {
          $size: {
            $filter: {
              input: "$isFollowing",
              as: "f",
              cond: {
                $eq: ["$$f.follower", mongoose.Types.ObjectId(req.user.id)],
              },
            },
          },
        },
      },
    },
  ]);
  await Like.populate(likes, {
    path: "user",
    select: "username profileImg name",
    
  });
  res.status(200).json({
    error: false,
    data: likes,
  });
});
export const getCommentLikes = asyncErrorWrapper(async (req, res, next) => {});
