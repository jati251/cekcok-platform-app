// pages/api/notifications/create.js

import Notification from "@models/notification";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  try {
    await connectToDB();
    const { recipientId, senderId, type, data } = await request.json();

    // Check for an existing notification
    let existingNotification = await Notification.findOne({
      sender: senderId,
      recipient: recipientId,
      data: data,
    });

    if (existingNotification) {
      // If notification exists, update the type
      existingNotification.type = type;
      existingNotification.read = false;
      await existingNotification.save();
    } else {
      // Create a new notification if none exists
      const newNotification = new Notification({
        sender: senderId,
        recipient: recipientId,
        data: data,
        type,
        read: false,
        createdAt: Date.now(),
      });
      await newNotification.save();
    }
    return new Response("Notification created/updated successfully", {
      status: 201,
    });
  } catch (error) {
    console.error("Failed to create notification", error);
    return new Response("Failed to create notification", { status: 500 });
  }
};
