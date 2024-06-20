import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic";

export const POST = async (request) => {
  const { query, page = 1, limit = 10, tag } = await request.json();

  try {
    await connectToDB();

    const regex = new RegExp(query, "i");
    const prompts = tag
      ? await Prompt.find({ tag: regex })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit))
          .populate("creator")
      : await Prompt.find({ prompt: regex })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(parseInt(limit))
          .populate("creator");

    const totalPromptCount = tag
      ? await Prompt.countDocuments({ tag: regex })
      : await Prompt.countDocuments({ prompt: regex });

    return new Response(
      JSON.stringify({
        prompts,
        totalPages: Math.ceil(totalPromptCount / limit),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to search prompts", error);
    return new Response("Failed to search prompts", { status: 500 });
  }
};
