import Comment from "@models/comment";
import { connectToDB } from "@utils/database";

export const PATCH = async (request, { params }) => {
  const { action, userId } = await request.json();

  try {
    await connectToDB();

    // Find the existing prompt by ID
    const existingComment = await Comment.findById(params.id);

    if (!existingComment) {
      return new Response("Comment not found", { status: 404 });
    }

    const userInteraction = existingComment.userInteractions.find(
      (interaction) => interaction.userId.toString() === userId
    );

    if (userInteraction) {
      if (userInteraction.action === action) {
        // If the action is the same, undo the action
        if (action === "like") existingComment.likes--;
        if (action === "hate") existingComment.hates--;
        existingComment.userInteractions =
          existingComment.userInteractions.filter(
            (interaction) => interaction.userId.toString() !== userId
          );
      } else {
        // If the action is different, switch the action
        if (action === "like") {
          existingComment.likes++;
          existingComment.hates--;
        }
        if (action === "hate") {
          existingComment.likes--;
          existingComment.hates++;
        }
        userInteraction.action = action;
      }
    } else {
      // If no previous interaction, add new interaction
      if (action === "like") existingComment.likes++;
      if (action === "hate") existingComment.hates++;
      existingComment.userInteractions.push({ userId, action });
    }

    await existingComment.save();

    return new Response(JSON.stringify(existingComment), { status: 200 });
  } catch (error) {
    return new Response("Error Updating Comment", { status: 500 });
  }
};
