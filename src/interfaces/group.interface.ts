import { Schema } from "mongoose";

export interface IGroup {
  name: string;
  members: Schema.Types.ObjectId[];
}
