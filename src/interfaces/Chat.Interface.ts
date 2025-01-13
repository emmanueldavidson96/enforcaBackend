import { Schema } from "mongoose";

export interface IChat {
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  message: string;
  date: Date;
  status: string;
}
