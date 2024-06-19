// pages/api/notifications/read.js

import Notification from "@models/notification";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  try {
    await connectToDB();
    const { notificationId } = await request.json();

    await Notification.findByIdAndUpdate(notificationId, { read: true });

    return new Response("Notification marked as read", { status: 200 });
  } catch (error) {
    console.error("Failed to mark notification as read", error);
    return new Response("Failed to mark notification as read", { status: 500 });
  }
};
