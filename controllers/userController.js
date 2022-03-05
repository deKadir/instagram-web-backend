import User from "../models/User.js";
import asyncErrorWrapper from "express-async-error-wrapper";

import mongoose from "mongoose";
import Follow from "../models/Follow";
export const follow = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const activeUserId = req.user.id;
  //cannot follow yourself
  if (userId === activeUserId) {
    return next(new Error("you cannot follow yourself"));
  }
  const following = await Follow.findOne({
    follower: activeUserId,
    following: userId,
  }).catch(() => {});

  if (following) {
    //already following then unfollow
    await following.remove();
    res.status(200).json({
      error: false,
      message: "unfollow",
      data: null,
    });
  } else {
    //not following. follow
    await Follow.create({ following: userId, follower: activeUserId }).then(
      (result) => {
        res.status(200).json({
          error: false,
          message: "follow",
          data: result,
        });
      }
    );
  }
});

export const getUserInfo = asyncErrorWrapper(async (req, res, next) => {
  const { username } = req.params;
  const activeUserId = req.user.id;
  const user = await User.aggregate([
    { $match: { username } },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "follower",
        as: "following",
      },
    },
    { $addFields: { following: { $size: "$following" } } },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },
    { $addFields: { followers: { $size: "$followers" } } },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "userId",
        as: "posts",
      },
    },
    { $addFields: { posts: { $size: "$posts" } } },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
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
                $eq: ["$$f.follower", mongoose.Types.ObjectId(activeUserId)],
              },
            },
          },
        },
      },
    },
    { $unset: ["password", "email"] },
  ]).catch(() => {
    return next(new Error("User not found"));
  });
  res.json({
    error: false,
    message: "success",
    data: user[0],
  });
});

export const getFollowers = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const activeUserId = req.user.id;
  const followers = await Follow.aggregate([
    { $match: { following: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "follows",
        localField: "follower",
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
                $eq: ["$$f.follower", mongoose.Types.ObjectId(activeUserId)],
              },
            },
          },
        },
      },
    },
  ]);
  await Follow.populate(followers, {
    path: "follower",
    select: "profileImg name username",
  });
  res.json({
    error: false,
    message: " success",
    followers: followers || [],
  });
});

export const getFollowings = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const activeUserId = req.user.id;
  const followings = await Follow.aggregate([
    { $match: { follower: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "follows",
        localField: "following",
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
                $eq: ["$$f.follower", mongoose.Types.ObjectId(activeUserId)],
              },
            },
          },
        },
      },
    },
  ]);
  await Follow.populate(followings, {
    path: "following",
    select: "username profileImg name",
  });
  res.json({
    error: false,
    message: " success",
    data: followings || [],
  });
});
export const updateUserInfo = asyncErrorWrapper(async (req, res, next) => {
  const { name, username, privateStatus, profileImg, email, bio } = req.body;
  const id = req.user.id;
  const user = await User.findByIdAndUpdate(
    id,
    {
      name,
      username,
      privateStatus,
      profileImg,
      email,
      bio,
    },
    { new: true }
  )
    .select("+email +phone")
    .catch((err) => next(new Error(err.message)));
  res.json({
    error: false,
    message: "successful",
    data: user,
  });
});
export const getCurrentUser = asyncErrorWrapper(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "follower",
        as: "following",
      },
    },
    { $addFields: { following: { $size: "$following" } } },
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },
    { $addFields: { followers: { $size: "$followers" } } },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "userId",
        as: "posts",
      },
    },
    { $addFields: { posts: { $size: "$posts" } } },
    { $unset: ["password"] },
  ]);
  res.status(200).json({
    error: false,
    message: "success",
    data: user[0],
  });
});

export const updateProfileImg = asyncErrorWrapper(async (req, res, next) => {
  const profileImg = req.file.filename;
  await User.findByIdAndUpdate(
    req.user.id,
    {
      profileImg: profileImg,
    },
    { new: true }
  )
    .then(() =>
      res.json({
        profileImg,
      })
    )
    .catch((e) => next(new Error("upload failed" + e.message)));
});
