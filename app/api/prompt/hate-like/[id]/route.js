import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const PATCH = async (request, { params }) => {
  const { action, userId } = await request.json();

  try {
    await connectToDB();

    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return new Response("Prompt not found", { status: 404 });
    }

    const userInteraction = existingPrompt.userInteractions.find(
      (interaction) => interaction.userId.toString() === userId
    );

    if (userInteraction) {
      if (userInteraction.action === action) {
        if (action === "like") existingPrompt.likes--;
        if (action === "hate") existingPrompt.hates--;
        existingPrompt.userInteractions =
          existingPrompt.userInteractions.filter(
            (interaction) => interaction.userId.toString() !== userId
          );
      } else {
        if (action === "like") {
          existingPrompt.likes++;
          existingPrompt.hates--;
        }
        if (action === "hate") {
          existingPrompt.likes--;
          existingPrompt.hates++;
        }
        userInteraction.action = action;
      }
    } else {
      if (action === "like") existingPrompt.likes++;
      if (action === "hate") existingPrompt.hates++;
      existingPrompt.userInteractions.push({ userId, action });
    }

    await existingPrompt.save();

    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    return new Response("Error Updating Prompt", { status: 500 });
  }
};
