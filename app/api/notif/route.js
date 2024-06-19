// pages/api/notifications/create.js

import Notification from "@models/notification";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  try {
    await connectToDB();
    const { recipientId, senderId, type, data } = await request.json();

    const newNotification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      data,
    });

    await newNotification.save();
    return new Response(JSON.stringify(newNotification), { status: 201 });
  } catch (error) {
    console.error("Failed to create notification", error);
    return new Response("Failed to create notification", { status: 500 });
  }
};
