import status from "http-status";
import { Chat } from "../models/chat.model";
import { RequestHandler, Response, Request, NextFunction } from "express";
import createHttpError from "http-errors";
import { validateDbId } from "../utils/mongoId";
import { Group } from "../models/group.model";

type createChatBody = {
  senderId: string;
  receiverId: string;
  groupId: string;
  message: string;
  date: Date;
}

type createGroupBody = {
  name: string;
  members: string[];
}

// http controller to save the chat sent to a group or a user
export const createChat: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { senderId, receiverId, groupId, message, date } = req.body as createChatBody;
        
    // Ensure only one of receiverId or groupId is provided
    if (receiverId && groupId) {
      throw createHttpError(status.BAD_REQUEST, "Provide either receiverId or groupId, not both.");
     
    }

    // ensure the ids are valid mongodb ids
    if (receiverId) await validateDbId(senderId, receiverId);
    if (groupId) await validateDbId(senderId, groupId);

    const chat = await Chat.create({
      senderId,
      receiverId,
      groupId,
      message,
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

// http controller to create a group chat of users
export const createGroup:RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, members } = req.body as createGroupBody;
    
    // validate the user ids of the group members
    await validateDbId(...members)
    
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

// http controller to add member to group
export const joinGroup:RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { groupId, userId } = req.body;
    
    await validateDbId(groupId, userId);

    const group = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { members: userId } },
      { new: true },
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

// http controller to delete a chat
export const deleteChat:RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

// http controller to load old chats
export const loadOldChats:RequestHandler = async (
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

// http controller to load old group chats
export const loadOldGroupChats:RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
