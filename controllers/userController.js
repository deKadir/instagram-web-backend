import User from "../models/User";
import asyncErrorWrapper from "express-async-error-wrapper";

export const follow = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.body;
  const activeUserId = req.user.id;
  const user = await User.findById(activeUserId).select("following");
  //follow if not following
  if (!user.following.includes(activeUserId)) {
    user.following.push(activeUserId);
    await user.save();
    await User.findByIdAndUpdate(userId, {
      $push: { followers: activeUserId },
    });
  }
  //unfollow if already following
  else {
    user.following.pull(activeUserId);
    await user.save();
    await User.findByIdAndUpdate(userId, {
      $pull: { followers: activeUserId },
    });
  }

  res.json({
    error: false,
    message: "success",
  });
});

export const getUserInfo = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.params;
  await User.findById(id)
    .then((response) => res.json({ error: false, data: response }))
    .catch(() => next(new Error("User not found")));
});

export const getFollowers = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;
  await User.findById(userId)
    .select("followers")
    .then((user) => {
      res.json({
        error: false,
        message: user.followers || [],
      });
    })
    .catch((err) => next(new Error(err.message)));
});

export const getFollowings = asyncErrorWrapper(async (req, res, next) => {
  const { userId } = req.params;
  await User.findById(userId)
    .populate("followers")
    .populate("following")

    .then((user) => {
      res.json({
        error: false,
        message: user.followings || [],
      });
    })
    .catch((err) => next(new Error(err.message)));
});
export const updateUserInfo = asyncErrorWrapper(async (req, res, next) => {
  const { name, username, privateStatus, profileImg, password, email, phone } =
    req.body;
  const id = req.user.id;
  await User.findByIdAndUpdate(id, {
    name,
    username,
    privateStatus,
    profileImg,
    password,
    email,
    phone,
  }).then(() =>
    res.json({
      error: false,
      message: "successful",
    })
  );
});
export const getCurrentUser = asyncErrorWrapper(async (req, res, next) => {
  const id = req.user.id;
  await User.findById(id)
    .select("+email +phone ")
    .populate("following")
    .then((result) =>
      res.status(200).json({
        error: false,
        message: "success",
        data: result,
      })
    )
    .catch((err) =>
      res.status(200).json({
        error: true,
        message: err.message,
      })
    );
});
