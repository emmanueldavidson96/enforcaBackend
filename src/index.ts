import express, { Request, Response } from "express";
import { Server, Socket } from "socket.io";
import { registerChatHandlers } from "./socket/chatHandler.socket";

const app = express();

const PORT = 8080;

app.use("/", (request:Request, response:Response) => {
    response.send("Welcome to Enforca Backend API")
})

const server = app.listen(PORT, () => {
    console.log(`App is running at port ${PORT}`)
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
const onConnection = (socket:Socket) => {
  registerChatHandlers(io, socket);
};

io.on("connect", onConnection);