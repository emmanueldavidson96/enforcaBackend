import { Router } from "express";
import {
  createChat,
  deleteChat,
  createGroup,
  joinGroup,
  loadOldChats,
  loadOldGroupChats,
} from "../controllers/chat.controller";
import verifyToken from "../middlewares/verifyToken";
import { validator } from "../middlewares/validator";
import { createChatSchema, createGroupSchema, joinGroupSchema } from "../validators/chat.validator";

export const chatRouter = Router();

// Create a new chat (personal or group)
chatRouter.route("/create").post(validator(createChatSchema), verifyToken, createChat);

// Delete a chat (personal or group)
chatRouter.route("/delete/:id").put(verifyToken, deleteChat);

// Load old personal chats between two users
chatRouter.route("/personal/:senderId/:receiverId").get(verifyToken, loadOldChats);

// Load old group chats for a specific group
chatRouter.route("/group/:groupId/chats").get(verifyToken, loadOldGroupChats);

// create a group
chatRouter.route("/create-group").post(validator(createGroupSchema), verifyToken, createGroup);

// join a group
chatRouter.route("/join-group").put(validator(joinGroupSchema), verifyToken, joinGroup);