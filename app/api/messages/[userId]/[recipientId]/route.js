import { connectToDB } from "@utils/database";
import Message from "@models/message";
import Notification from "@models/notification";

export const GET = async (request, { params }) => {
  const { userId, recipientId } = params;

  await connectToDB();

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId, recipientId },
        { senderId: recipientId, recipientId: userId },
      ],
    }).sort({ createdAt: 1 });

    // Update notifications to mark as read
    await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );

    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return new Response("Failed to fetch messages", { status: 500 });
  }
};
