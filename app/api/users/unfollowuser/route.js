// unfollowUser.js
import Follower from "@models/follower";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  const { followerId, followingId } = await request.json();

  try {
    await connectToDB();

    // Remove the follow relationship
    const result = await Follower.findOneAndDelete({
      follower: followerId,
      following: followingId,
    });

    if (!result) {
      return new Response("Follow relationship not found", { status: 404 });
    }

    return new Response("Unfollowed successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to unfollow user", error);
    return new Response("Failed to unfollow user", { status: 500 });
  }
};
