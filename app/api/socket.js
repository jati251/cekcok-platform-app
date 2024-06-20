// pages/api/socket.js
import { Server } from "socket.io";
import Notification from "@models/notification";
import Message from "@models/message";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    res.end();
    return;
  }

  const io = new Server(res.socket.server, {
    path: "/api/socket.io",
  });
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    const { userId } = socket.handshake.query;
    socket.join(userId);
    console.log(userId, recipientId);
    socket.on("sendMessage", async ({ recipientId, content }) => {
      const message = await Message.create({
        sender: userId,
        recipient: recipientId,
        content,
      });
      io.to(recipientId).emit("receiveMessage", message);

      // Create a notification
      await Notification.create({
        recipient: recipientId,
        sender: userId,
        type: "message",
      });
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  res.end();
};

export default SocketHandler;
