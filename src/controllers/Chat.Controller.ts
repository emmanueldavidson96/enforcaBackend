import status from "http-status";
import { Chat } from "../model/Chat.Model";
import { Request, Response, NextFunction } from "express";
import { validateDbId } from "../utils/mongoId.utils";

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { senderId, receiverId, message, sentAt, date } = req.body;
    await validateDbId(senderId, receiverId);

    const chat = await Chat.create({
      senderId,
      receiverId,
      message,
      sentAt,
      date,
    });

    const myChat = await Chat.findById(chat._id).populate({
      path: "senderId",
      select: "userName fullName displayImage isOnline email phone role",
    });
    return res.status(status.OK).json({
      status: "success",
      statusCode: status.OK,
      data: {
        chat: myChat,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteChat = async (req: Request, res: Response, next: NextFunction) => {
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

    return res.status(status.OK).json({
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

const loadOldChats = async (
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
      select: "fullName displayImage isOnline email phone role",
    });

    return res.status(status.OK).json({
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

module.exports = {
  createChat,
  deleteChat,
  loadOldChats,
};
