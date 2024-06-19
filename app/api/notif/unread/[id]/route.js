// pages/api/notifications/unreadCount.js

import Notification from "@models/notification";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic"; // Optional, depending on your setup

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const userId = params.id;
    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      read: false,
    });

    return new Response(JSON.stringify({ unreadCount }), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch unread notification count", error);
    return new Response("Failed to fetch unread notification count", {
      status: 500,
    });
  }
};
