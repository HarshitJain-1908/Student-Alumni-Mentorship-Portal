import { Conversation } from "../models/conversationModel.js";
import mongoose from "mongoose";

export const newConversation = async (req, res, next) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.query.user_id.toString()] },
    });
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};



export const updateConversation = async (req, res, next) => {
  try {
    const updatedConversation = await Conversation.findByIdAndUpdate(
      new mongoose.Types.ObjectId(req.query.conversationId),
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!updatedConversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    res.json(updatedConversation);
  } catch (error) {
    next(error);
  }
};

export const conversationsByDate = async (req, res, next) => {
  try {
    const conversations = await Conversation.aggregate([
      {
        $project: {
          yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
      },
      {
        $group: {
          _id: "$yearMonthDay",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};



// export const findConversation = async (req, res, next) => {
//   try {
//     const conversation = await Conversation.findOne({
//       members: { $all: [req.query.senderId, req.query.receiverId] },
//     });
//     if (conversation) {
//       res.status(200).json({
//         success: true,
//         message: "Conversation found",
//       });
//     } else {
//       res.status(200).json({
//         success: false,
//         message: "Conversation not found",
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

