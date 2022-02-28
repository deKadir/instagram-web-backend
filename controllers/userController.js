import User from "../models/User";
import asyncErrorWrapper from "express-async-error-wrapper";
import Post from "../models/Post";
export const follow = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;
  const activeUserId = req.user.id;

  if (userId === activeUserId) {
    return next(new Error("you cannot follow yourself"));
  }
  const user = await User.findOne({
    _id: activeUserId,
    following: { $in: [userId] },
  })
    .populate("following", "username")
    .catch((e) => next(new Error(e.message)));

  if (user) {
    user.following.pull(userId);
    user.save();
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: activeUserId },
    }).catch((e) => next(new Error(e.message)));
    res.json({
      error: false,
      message: "unfollow",
      data: user.following,
    });
  } else {
    const u = await User.findByIdAndUpdate(
      activeUserId,
      {
        $push: { following: userId },
      },
      { new: true }
    )
      .populate("following", "username")
      .catch((e) => next(new Error(e.message)));
    await User.findByIdAndUpdate(userId, {
      $push: { followers: activeUserId },
    }).catch((e) => next(new Error(e.message)));
    res.json({
      error: false,
      message: "follow",
      data: u.following,
    });
  }
});

export const getUserInfo = asyncErrorWrapper(async (req, res, next) => {
  const { username } = req.params;
  const user = await User.findOne({ username })
    .populate("followers")
    .populate("following");
  if (user) {
    const posts = await Post.count({ userId: user.id });
    res.json({
      error: false,
      message: "success",
      data: {
        ...user.toObject(),
        followers: user.followers.length,
        following: user.following.length,
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
  await User.findById(userId)
    .populate("followers", "username name profileImg")
    .then((user) => {
      res.json({
        error: false,
        message: " success",
        data: user.followers || [],
      });
    })
    .catch((err) => next(new Error("user not found")));
});

export const getFollowings = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;
  await User.findById(userId)
    .populate("following", "name username profileImg")

    .then((user) => {
      res.json({
        error: false,
        message: "success",
        data: user.following || [],
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
    .populate("following", "username")
    .populate("followers", "username")
    .catch((err) => next(new Error(err.message)));
  res.json({
    error: false,
    message: "successful",
    data: user,
  });
});
export const getCurrentUser = asyncErrorWrapper(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id)
    .select("+email +phone")
    .populate("following", "username")
    .populate("followers", "username");
  const posts = await Post.count({ userId: id });
  res.status(200).json({
    error: false,
    message: "success",
    data: { ...user.toObject(), posts },
  });
});
