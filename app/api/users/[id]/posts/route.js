import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic";
export const POST = async (request) => {
  try {
    await connectToDB();
    const { page = 1, limit = 10, userId } = await request.json();

    const count = await Prompt.countDocuments({ creator: userId });
    const prompts = await Prompt.find({ creator: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("creator");

    return new Response(
      JSON.stringify({ prompts, totalPages: Math.ceil(count / limit) })
    );
  } catch (error) {
    return new Response("Failed to fetch prompts created by user", {
      status: 500,
    });
  }
};
