import { connectToDB } from "@utils/database";
import Comment from "@models/comment";

export const dynamic = "force-dynamic";
export const POST = async (request) => {
  const { postId } = await request.json();

  try {
    await connectToDB();

    let comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "username email image fullName status");

    comments = comments.map((comment) => {
      if (comment.author.status === "private") {
        comment.author.fullName = "Anonim";
        comment.author.email = "Anonim";
        comment.author.username = "Anonim";
        comment.author.image = null;
      }
      return comment;
    });

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response("Error fetching comments", { status: 500 });
  }
};
