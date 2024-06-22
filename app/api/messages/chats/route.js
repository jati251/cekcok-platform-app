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

    const senders = await Message.distinct("senderId", {
      $or: [{ senderId: userId }, { recipientId: userId }],
    });

    function removeDuplicates(arr) {
      return arr.filter((item, index) => arr.indexOf(item) === index);
    }

    const filteredReps = removeDuplicates(recipients);
    const totalRecipients = filteredReps.length;

    const paginatedRecipientIds = filteredReps.slice(
      (page - 1) * limit,
      page * limit
    );

    const notif = [];

    for (const recipientId of paginatedRecipientIds) {
      const latestMessage = await Message.findOne({
        $or: [
          { senderId: userId, recipientId },
          { senderId: recipientId, recipientId: userId },
        ],
      })
        .sort({ createdAt: -1 })
        .populate("senderId", "username image fullName")
        .populate("recipientId", "username image fullName")
        .exec();

      if (latestMessage) {
        const latestNotif = await Notification.findOne({
          $or: [
            {
              recipient: latestMessage.recipientId._id,
              sender: latestMessage.senderId._id,
            },
            {
              recipient: latestMessage.recipientId._id,
              sender: latestMessage.senderId._id,
            },
          ],
        }).sort({ createdAt: -1 });

        notif.push({
          read: latestNotif?.read,
          type: "message",
          recipient: userId,
          sender: {
            _id: latestMessage.senderId._id,
            username: latestMessage.senderId.username,
            image: latestMessage.senderId.image,
            fullName: latestMessage.senderId.fullName,
          },
          recipient: {
            _id: latestMessage.recipientId._id,
            username: latestMessage.recipientId.username,
            image: latestMessage.recipientId.image,
            fullName: latestMessage.recipientId.fullName,
          },
          data: { message: latestMessage.message },
          lastMessageSender:
            latestMessage.senderId === userId
              ? "You"
              : latestMessage.senderId.username,
        });
      }
    }

    const result = notif.filter((item, index) => notif.indexOf(item) === index);

    return new Response(
      JSON.stringify({
        notif: result,
        totalPages: Math.ceil(totalRecipients / limit),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch chat list", error);
    return new Response("Failed to fetch chat list", { status: 500 });
  }
};
