import { Schema, model, Types } from "mongoose";
import { IChat } from "../interfaces/chat.interface";

const chatSchema = new Schema<IChat>(
  {
    senderId: {
      type: Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "User",
    },
    groupId: {
      type: Types.ObjectId,
      ref: "Group",
    },
    message: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "deleted"],
    },
  },
  {
    timestamps: true,
  },
);

//Export the model
export const Chat = model("Chat", chatSchema);
