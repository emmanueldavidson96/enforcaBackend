import { Socket } from "socket.io";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";

export const socketAuthMiddleware = async (socket:Socket) => {
  try {
    const { token, id } = socket.handshake.auth;
    if (!token || !id) throw new Error("no token or id provided");
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (!payload) throw new Error("error verifying token");
    return true;
  } catch (error) {
    return false;
  }
};