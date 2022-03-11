import User from "../models/User.js";
import asyncErrorWrapper from "express-async-error-wrapper";
import Follow from "../models/Follow.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Post from "../models/Post.js";
import { sendMail } from "../helpers/mail.js";
import jwt from "jsonwebtoken";
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
    {
      $project: {
        name: 1,
        bio: 1,
        username: 1,
        followers: 1,
        following: 1,
        profileImg: 1,
        privateStatus: 1,
        posts: 1,
        isFollowing: 1,
        verified: 1,
      },
    },
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

export const changePassword = asyncErrorWrapper(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;
  let user = await User.findById(userId)
    .select("+password")
    .catch(() => {
      return next(new Error("user not found"));
    });
  bcrypt.compare(currentPassword, user.password, (err, result) => {
    if (err) {
      return next(new Error(err.message));
    }
    if (!result) {
      return next(new Error("current password is wrong"));
    } else {
      user.password = newPassword;
      user.save();
      res.status(200).json({
        error: false,
        message: "password is updated",
      });
    }
  });
});

export const searchUser = asyncErrorWrapper(async (req, res, next) => {
  await User.find({ username: { $regex: req.query.username } })
    .limit(8)
    .select("profileImg username name ")
    .then((result) => {
      res.status(200).json({
        error: false,
        users: result,
      });
    });
});

export const savePost = asyncErrorWrapper(async (req, res, next) => {
  const post = await Post.findById(req.params.postId).select("saved");
  if (post.saved.includes(req.user.id)) {
    await post.saved.pull(req.user.id);
    await post.save();
    res.json({
      error: false,
      message: "unsave",
    });
  } else {
    await post.saved.push(req.user.id);
    await post.save();
    res.json({
      error: false,
      message: "save",
    });
  }
});

export const getSavedPosts = asyncErrorWrapper(async (req, res, next) => {
  const posts = await Post.aggregate([
    {
      $match: { saved: mongoose.Types.ObjectId(req.user.id) },
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
        likeCount: {
          $size: "$liked",
        },
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
      $project: {
        photos: 1,
        likeCount: 1,
        commentCount: 1,
      },
    },
  ]);

  res.json({
    error: false,
    posts: posts,
  });
});

export const sendVerificationCode = asyncErrorWrapper(
  async (req, res, next) => {
    const u = await User.findOne({ email: req.query.mail }).catch((e) =>
      next(new Error("user not found"))
    );

    if (u) {
      let token = jwt.sign({ data: { id: u._id } }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      await sendMail(
        req.query.mail,
        "verification link",
        `${process.env.BASE_URL}/reset-password/${token}`
      )
        .then(() => {
          res.json({
            error: false,
            message: "verification code submitted. check your email",
          });
        })
        .catch((e) =>
          res.json({
            error: true,
            message: `error: ${e.message}`,
          })
        );
    } else {
      res.json({
        error: true,
        message: "no user found with this email",
      });
    }
  }
);
export const resetPassword = asyncErrorWrapper(async (req, res, next) => {
  jwt.verify(req.query.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      next(new Error(`token error: ${err.message}`));
    }
  });
  let userId = jwt.decode(req.query.token).data.id;
  let u = await User.findById(userId)
    .select("password")
    .catch(() => {
      res.json({
        error: true,
        message: "user not found ",
      });
    });
  if (u) {
    u.password = req.body.password;
    await u.save();
  }
  res.json({
    error: false,
    message: "password changed successfully",
  });
});
