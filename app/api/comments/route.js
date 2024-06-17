import { connectToDB } from "@utils/database";
import Comment from "@models/comment";
import Prompt from "@models/prompt";

export const POST = async (req, res) => {
  try {
    await connectToDB();
    const { content, author, post, media } = await req.json();

    const newComment = new Comment({ content, author, post, media });
    await newComment.save();

    // Update the prompt with the new comment
    await Prompt.findByIdAndUpdate(post, {
      $push: { comments: newComment._id },
    });

    return new Response(JSON.stringify(newComment), { status: 201 });
  } catch (error) {
    return new Response("Error creating comment", { status: 500 });
  }
};
