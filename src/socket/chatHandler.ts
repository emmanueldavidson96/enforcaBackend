import { Server, Socket } from "socket.io";
import User from "../models/user.model";
import { Group } from "../models/group.model";
import { Chat } from "../models/chat.model";

type clientData = {
  senderId: string;
  receiverId: string;
  groupId: string;
  message: string;
};

export const registerChatHandlers = (io: Server, socket: Socket) => {
  const id: string = socket.handshake.headers.id as string;

  // Add the new socket ID to the user's array of socket IDs
  const updateOnlineStatus = async () => {
    const user = await User.findById(id);
    if (user) {
      user.isOnline = true;
      if (!user.socketIds.includes(socket.id)) {
        user.socketIds.push(socket.id);
      }
      await user.save();
      socket.broadcast.emit("currentlyOnline", { id });
    }
  };

  // Handle new chats
  const handleNewChats = async (data: clientData) => {
    const { senderId, receiverId, groupId, message } = data;

    if (groupId) {
      // Group chat handling
      const group = await Group.findById(groupId).select("members");
      if (group) {
        group.members.forEach(async (member) => {
          if (member.toString() !== senderId) {
            const memberData = await User.findById(member).select("socketIds");
            memberData?.socketIds.forEach((socketId) => {
              socket.to(socketId).emit("group:message", {
                groupId,
                senderId,
                message,
              });
            });
          }
        });
      }
    } else if (receiverId) {
      // Personal chat handling
      const receiver = await User.findById(receiverId).select("socketIds");
      receiver?.socketIds.forEach((socketId) => {
        socket.to(socketId).emit("personal:message", { senderId, message });
      });
    }
  };

  // Handle chat deletion
  const handleDeletedChat = async (data: {
    chatId: string;
    groupId?: string;
  }) => {
    const { chatId, groupId } = data;

    if (groupId) {
      const group = await Group.findById(groupId).select("members");
      if (group) {
        group.members.forEach(async (member) => {
          const memberData = await User.findById(member).select("socketIds");
          memberData?.socketIds.forEach((socketId) => {
            socket.to(socketId).emit("group:chatDeleted", { chatId });
          });
        });
      }
    } else {
      const chat = await Chat.findById(chatId).select("senderId receiverId");
      if (chat) {
        const { senderId, receiverId } = chat;
        [senderId, receiverId].forEach(async (userId) => {
          const user = await User.findById(userId).select("socketIds");
          user?.socketIds.forEach((socketId) => {
            socket.to(socketId).emit("personal:chatDeleted", { chatId });
          });
        });
      }
    }
  };

  // Handle joining a group
  const handleJoinGroup = async (data: { groupId: string }) => {
    const { groupId } = data;
    const group = await Group.findById(groupId).select("members");
    if (group) {
      group.members.forEach(async (member) => {
        const memberData = await User.findById(member).select("socketIds");
        memberData?.socketIds.forEach((socketId) => {
          socket.to(socketId).emit("group:joined", { groupId, newMember: id });
        });
      });
    }
  };

  // Handle disconnect event
  const disconnectEvent = async () => {
    const user = await User.findById(id);
    if (user) {
      user.socketIds = user.socketIds.filter(
        (socketId) => socketId !== socket.id,
      );
      if (user.socketIds.length === 0) {
        user.isOnline = false;
        socket.broadcast.emit("currentlyOffline", { id });
      }
      await user.save();
    }
  };

  // Register event handlers
  updateOnlineStatus();

  socket.on("chats:new", handleNewChats);
  socket.on("chats:deleted", handleDeletedChat);
  socket.on("group:join", handleJoinGroup);
  socket.on("disconnect", disconnectEvent);
};
