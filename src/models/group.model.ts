import { Schema, model, Types } from "mongoose";
import { IGroup } from "../interfaces/group.interface";

const groupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Group = model("Group", groupSchema);
