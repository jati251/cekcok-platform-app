// server.js
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const Message = require("./models/message"); // Import the Message model
const Notification = require("./models/notification"); // Import the Message model

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    path: "/api/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join", (roomId) => {
      socket.join(roomId); // Join the room based on roomId
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on(
      "privateMessage",
      async ({ roomId, recipientId, message, senderId }) => {
        const newMessage = new Message({
          message,
          senderId,
          recipientId,
        });
        await newMessage.save();

        const newNotification = new Notification({
          data: { message },
          sender: senderId,
          recipient: recipientId,
          type: "message",
        });
        await newNotification.save();

        io.to(roomId).emit("receivePrivateMessage", {
          message,
          senderId,
          recipientId,
          createdAt: newMessage.createdAt,
        });

        socket.emit("messageSent", {
          message,
          senderId,
          recipientId,
          createdAt: newMessage.createdAt,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  mongoose.set("strictQuery", true);

  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: "share_cekcok",
    })
    .then(() => {
      console.log("MongoDB connected");
      server.listen(3000, (err) => {
        if (err) throw err;
        console.log("> Ready on http://www.cekcok.my.id");
      });
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
});
