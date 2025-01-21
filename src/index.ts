import "dotenv/config";
import mongoose from "mongoose";
import morgan from "morgan";
import createHttpError, {isHttpError} from "http-errors";
import cors from "cors";
import env from "./utils/validateEnv";
import app from "./app";
import { connectDB } from "./db/connectDB";
import { registerChatHandlers } from "./socket/chatHandler";
import { Server, Socket } from "socket.io";


const server = app.listen(env.PORT, () => {
    connectDB()
    console.log(`Application is running at port ${env.PORT}`)
})

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["POST, GET, PUT, PATCH, DELETE"],
    credentials: true,
  },
});

// add authentication middleware
// io.use(async (socket:Socket, next) => {
//   const isVerified = await socketAuthMiddleware(socket);
//   if (isVerified) {
//     console.log("socket authenticated");
//     next();
//   } else {
//     next(
//       new Error("invalid request, add token and id fields in auth header")
//     );
//   }
// });

// connection handler
const onConnection = (socket: Socket) => {
  console.log("Socket connected")
  registerChatHandlers(io, socket);
};

io.on("connect", onConnection);
