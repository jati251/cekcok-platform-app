// pages/api/chat-list.js

import Message from "@models/message";
import Notification from "@models/notification";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  const { userId, page = 1, limit = 10 } = await request.json();

  try {
    await connectToDB();

    // Fetch distinct recipients where the current user (userId) is the sender or recipient
    const recipients = await Message.distinct("recipientId", {
      $or: [{ senderId: userId }, { recipientId: userId }],
    });

    // Prepare an array to store chat details
    const totalRecipients = recipients.length;

    // Paginate recipients array
    const paginatedRecipientIds = recipients.slice(
      (page - 1) * limit,
      page * limit
    );

    const notif = [];

    // Fetch the latest message for each recipient
    for (const recipientId of paginatedRecipientIds) {
      const latestMessage = await Message.findOne({
        $or: [
          { senderId: userId, recipientId },
          { senderId: recipientId, recipientId: userId },
        ],
      })
        .sort({ createdAt: -1 })
        .populate("senderId", "username image fullName") // Populate senderId with username and image
        .exec();

      if (latestMessage) {
        const latestNotif = await Notification.findOne({
          recipient: userId,
          sender: latestMessage.senderId._id,
        }).sort({ createdAt: -1 });

        notif.push({
          read: latestNotif?.read,
          type: "message",
          recipient: recipientId,
          sender: {
            _id: latestMessage.senderId._id,
            username: latestMessage.senderId.username,
            image: latestMessage.senderId.image,
            fullName: latestMessage.senderId.fullName,
          },
          data: { message: latestMessage.message },
          lastMessageSender:
            latestMessage.senderId === userId
              ? "You"
              : latestMessage.senderId.username,
        });
      }
    }

    return new Response(
      JSON.stringify({ notif, totalPages: Math.ceil(totalRecipients / limit) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch chat list", error);
    return new Response("Failed to fetch chat list", { status: 500 });
  }
};
