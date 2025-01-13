import { Router } from "express";
import {
  createChat,
  deleteChat,
  createGroup,
  joinGroup,
  loadOldChats,
  loadOldGroupChats,
} from "../controllers/Chat.Controller";

export const chatRouter = Router();

// Create a new chat (personal or group)
chatRouter.route("/create").post(createChat);

// Delete a chat (personal or group)
chatRouter.route("/delete/:id").put(deleteChat);

// Load old personal chats between two users
chatRouter.route("/personal/:senderId/:receiverId").get(loadOldChats);

// Load old group chats for a specific group
chatRouter.route("/group/:groupId/chats").get(loadOldGroupChats);

// create a group
chatRouter.route("/create-group").post(createGroup);

// join a group
chatRouter.route("/join-group").put(joinGroup);