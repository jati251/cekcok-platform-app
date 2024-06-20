// pages/api/chat-list.js

import Message from "@models/message";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  const { userId } = await request.json();

  try {
    await connectToDB();

    // Fetch distinct recipients where the current user (userId) is the sender or recipient
    const recipients = await Message.distinct("recipientId", {
      $or: [{ senderId: userId }, { recipientId: userId }],
    });

    // Prepare an array to store chat details
    const chatList = [];

    // Fetch the latest message for each recipient
    for (const recipientId of recipients) {
      const latestMessage = await Message.findOne({
        $or: [
          { senderId: userId, recipientId },
          { senderId: recipientId, recipientId: userId },
        ],
      })
        .sort({ createdAt: -1 })
        .populate("senderId", "username image") // Populate senderId with username and image
        .populate("recipientId", "username image") // Populate recipientId with username and image
        .exec();

      if (latestMessage) {
        chatList.push({
          recipientId,
          recipientUsername: latestMessage.recipientId.username,
          recipientImage: latestMessage.recipientId.image,
          lastMessage: latestMessage.message,
          lastMessageSender:
            latestMessage.senderId === userId
              ? "You"
              : latestMessage.senderId.username,
        });
      }
    }

    return new Response(JSON.stringify(chatList), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch chat list", error);
    return new Response("Failed to fetch chat list", { status: 500 });
  }
};
