import User from "../models/User";
import asyncErrorWrapper from "express-async-error-wrapper";
import Post from "../models/Post";
import Follow from "../models/Follow";
export const follow = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const activeUserId = req.user.id;

  if (userId === activeUserId) {
    return next(new Error("you cannot follow yourself"));
  }
  const isFollowing = await Follow.findOne({
    follower: activeUserId,
    following: userId,
  }).catch((e) => {});
  if (isFollowing) {
    isFollowing.remove();
    isFollowing.save();
    res.json({
      error: false,
      message: "unfollow",
    });
  } else {
    await Follow.create({ follower: activeUserId, following: userId });
    res.json({
      error: false,
      message: "follow",
    });
  }
});

export const getUserInfo = asyncErrorWrapper(async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username }).catch((e) => {});
  if (user) {
    const posts = await Post.count({ userId: user.id });
    const followers = await Follow.count({ following: user.id });
    const following = await Follow.count({ follower: user.id });

    res.json({
      error: false,
      message: "success",
      data: {
        ...user.toObject(),
        followers,
        following,
        posts,
      },
    });
  } else {
    res.json({
      error: true,
      message: "user not found",
      data: {},
    });
  }
});

export const getFollowers = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;
  await Follow.find({ following: userId })
    .populate("follower", "profileImg username name ")
    .then((followers) => {
      res.json({
        error: false,
        message: " success",
        data: followers || [],
      });
    })
    .catch((err) => next(new Error("user not found")));
});

export const getFollowings = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;

  Follow.find({ follower: userId })
    .populate("following", "name username profileImg")

    .then((following) => {
      res.json({
        error: false,
        message: "success",
        data: following || [],
      });
    })
    .catch((err) => next(new Error("user not found")));
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
  const user = await User.findById(id).select("+email +phone");
  const posts = await Post.count({ userId: id });
  const followers = await Follow.count({ following: id });
  const following = await Follow.count({ follower: id });
  res.status(200).json({
    error: false,
    message: "success",
    data: { ...user.toObject(), posts, followers, following },
  });
});
