import { connectToDB } from "@utils/database";
import Message from "@models/message";

export const dynamic = "force-dynamic";

export const POST = async (req, res) => {
  const { userId, recipientId } = await req.json();

  await connectToDB();

  const messages = await Message.find({
    $or: [
      { senderId: userId, recipientId },
      { senderId: recipientId, recipientId: userId },
    ],
  }).sort({ createdAt: 1 });

  return new Response(JSON.stringify(messages), { status: 200 });
};
