import Message from "@models/message";
import Notification from "@models/notification";
import { connectToDB } from "@utils/database";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { senderId, recipientId, message } = await req.json();

    if (!senderId || !recipientId || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Message({
      senderId,
      recipientId,
      message,
    });

    await newMessage.save();

    const newNotification = new Notification({
      data: { message },
      sender: senderId,
      recipient: recipientId,
      type: "message",
    });
    await newNotification.save();

    return new Response(JSON.stringify(newMessage), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new message", { status: 500 });
  }
};
