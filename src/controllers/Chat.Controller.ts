import status from "http-status";
import { Chat } from "../model/Chat.Model";
import { Request, Response, NextFunction } from "express";
import { validateDbId } from "../utils/mongoId.utils";
import { Group } from "../model/Group.Model";

export const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { senderId, receiverId, groupId, message, sentAt, date } = req.body;

    // Ensure only one of receiverId or groupId is provided
    if (receiverId && groupId) {
       res.status(status.BAD_REQUEST).json({
        status: "error",
        message: "Provide either receiverId or groupId, not both.",
      });
    }

    if (receiverId) await validateDbId(senderId, receiverId);
    if (groupId) await validateDbId(senderId, groupId);

    const chat = await Chat.create({
      senderId,
      receiverId,
      groupId,
      message,
      sentAt,
      date,
    });

    const myChat = await Chat.findById(chat._id).populate({
      path: "senderId",
      select: "name isOnline email phone",
    });

     res.status(status.OK).json({
      status: "success",
      statusCode: status.OK,
      data: { chat: myChat },
    });
  } catch (error) {
    next(error);
  }
};

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, members } = req.body;

    const group = await Group.create({ name, members });

     res.status(status.CREATED).json({
      status: "success",
      statusCode: status.CREATED,
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

export const joinGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupId, userId } = req.body;
    await validateDbId(groupId, userId);

    const group = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true }
    );

     res.status(status.OK).json({
      status: "success",
      statusCode: status.OK,
      data: { group },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await validateDbId(id);

    const chat = await Chat.findByIdAndUpdate(
      id,
      {
        message: "This message was deleted",
        status: "deleted",
      },
      { new: true },
    );

     res.status(status.OK).json({
      status: "success",
      statusCode: status.OK,
      data: {
        chat,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loadOldChats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { senderId, receiverId } = req.params;

    const chats = await Chat.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate({
      path: "senderId",
      select: "name isOnline email phone",
    });

     res.status(status.OK).json({
      status: "success",
      statusCode: status.OK,
      data: {
        chats,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loadOldGroupChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupId } = req.params;

    // Validate the groupId
    await validateDbId(groupId);

    // Fetch chats belonging to the specified group
    const chats = await Chat.find({ groupId })
      .sort({ createdAt: 1 }) // Sort messages in chronological order
      .populate({
        path: "senderId",
        select: "name isOnline email phone", // Populate sender details
      });

     res.status(status.OK).json({
      status: "success",
      statusCode: status.OK,
      data: {
        chats,
      },
    });
  } catch (error) {
    next(error);
  }
};