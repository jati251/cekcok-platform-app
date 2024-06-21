// pages/api/notifications/unreadCount.js

import Notification from "@models/notification";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic"; // Optional, depending on your setup

// ini buat get count
export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const userId = params.id;
    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    // Count unread messages
    const unreadMessageCount = await Notification.countDocuments({
      recipient: userId,
      read: false,
      type: "message", // Assuming 'message' is the type for messages
    });

    // Count unread notifications excluding messages
    const unreadOtherCount = await Notification.countDocuments({
      recipient: userId,
      read: false,
      type: { $ne: "message" }, // Exclude 'message' type
    });

    return new Response(
      JSON.stringify({ unreadMessageCount, unreadOtherCount }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch unread notification count", error);
    return new Response("Failed to fetch unread notification count", {
      status: 500,
    });
  }
};
