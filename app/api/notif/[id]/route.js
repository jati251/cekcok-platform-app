// pages/api/notifications/index.js

import Notification from "@models/notification";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic";
export const POST = async (request, { params }) => {
  const { page = 1, limit = 10 } = await request.json();

  try {
    await connectToDB();

    const notif = await Notification.find({
      recipient: params.id,
      type: { $ne: "message" },
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("sender", "username image fullName");

    await Notification.updateMany(
      { recipient: params.id, read: false },
      { $set: { read: true } }
    );

    const count = await Notification.countDocuments({ recipient: params.id });

    return new Response(
      JSON.stringify({ notif, totalPages: Math.ceil(count / limit) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch notifications", error);
    return new Response("Failed to fetch notifications", { status: 500 });
  }
};
