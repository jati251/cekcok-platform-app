// pages/api/notifications/unreadCount.js

import Notification from "@models/notification";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic"; // Optional, depending on your setup

// ini buat get count
export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const userId = params.id;
    if (!userId || userId === "undefined") {
      return new Response("User ID is required", { status: 400 });
    }

    const unreadMessageCount = await Notification.countDocuments({
      recipient: userId,
      read: false,
      type: "message",
    });

    const unreadOtherCount = await Notification.countDocuments({
      recipient: userId,
      read: false,
      type: { $ne: "message" },
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
