import { Server, Socket } from "socket.io";
import { UserModel as User } from "../model/User.Model";

export const registerChatHandlers = (io:Server, socket:Socket) => {
  const id = socket.handshake.auth.id;
  console.log("A new socket connected", id);
  //   write the socket event handlers

  const updateOnlineStatus = async () => {
    socket.broadcast.emit("currentlyOnline", { id });
    await User.findByIdAndUpdate(id, { isOnline: true });
  };

  const handleNewChats = (data:any) => {
    socket.broadcast.emit("loadNewChats", data);
  };

  const handleDeletedChat = (id:string) => {
    socket.broadcast.emit("clearDeletedChats", { id });
  };

  const disconnectEvent = async () => {
    socket.broadcast.emit("currentlyOffline", { id });
    await User.findByIdAndUpdate(id, { isOnline: false });
  };

  // initialize the socket events with the handlers

  updateOnlineStatus();

  socket.on("chats:new", handleNewChats);

  socket.on("chats:deleted", handleDeletedChat);

  socket.on("disconnect", disconnectEvent);
};
