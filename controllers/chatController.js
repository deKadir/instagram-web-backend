import asyncErrorWrapper from "express-async-error-wrapper";
import Message from "../models/Message.js";
import Room from "../models/Room.js";
import mongoose from "mongoose";
export const sendMessage = asyncErrorWrapper(async (req, res, next) => {
  const { text, roomId } = req.body;

  await Message.create({
    text,
    sender: req.user.id,
    roomId,
  });

  res.status(200).json({
    error: false,
    message: "message submitted",
  });
});
export const getMessages = asyncErrorWrapper(async (req, res, next) => {
  const room = await Room.aggregate([
    {
      $match: {
        _id: mongoose.Types.ObjectId(req.query.room),
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "_id",
        foreignField: "roomId",
        as: "messages",
      },
    },
  ]);
  await Room.populate(room, { path: "users", select: "profileImg username" });
  await Message.find({ roomId: req.query.room }).then((messages) => {
    res.json({
      error: false,
      ...room[0],
    });
  });
});

export const getRooms = asyncErrorWrapper(async (req, res, next) => {
  const rooms = await Room.aggregate([
    {
      $match: { users: mongoose.Types.ObjectId(req.user.id) },
    },
    {
      $lookup: {
        from: "messages",
        localField: "_id",
        foreignField: "roomId",
        as: "lastMessage",
        let: { indicator_id: "$_id" },
        pipeline: [
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 1,
          },
        ],
      },
    },
  ]);
  await Room.populate(rooms, { path: "users", select: "profileImg username" });

  res.json({
    error: false,
    rooms,
  });
});
