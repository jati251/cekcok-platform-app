import { connectToDB } from "@utils/database";
import Comment from "@models/comment";

export const dynamic = "force-dynamic";
export const POST = async (request) => {
  const { postId } = await request.json();

  try {
    await connectToDB();

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username email image"
    );

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new Response("Error fetching comments", { status: 500 });
  }
};
