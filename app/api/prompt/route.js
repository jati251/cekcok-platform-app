import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic";
export const POST = async (request) => {
  try {
    await connectToDB();
    const { page = 1, limit = 10 } = await request.json();

    const count = await Prompt.countDocuments();
    let prompts = await Prompt.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("creator");

    prompts = prompts.map((prompt) => {
      if (prompt.creator.status === "private") {
        prompt.creator.fullName = "Anonim";
        prompt.creator.email = "Anonim";
        prompt.creator.username = "Anonim";
        prompt.creator.image = null;
      }
      return prompt;
    });

    return new Response(
      JSON.stringify({ prompts, totalPages: Math.ceil(count / limit) }),
      { status: 200 }
    );
  } catch (error) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
