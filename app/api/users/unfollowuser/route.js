// unfollowUser.js
import Follower from "@models/follower";
import UserProfile from "@models/profile";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  const { followerId, followingId } = await request.json();

  try {
    await connectToDB();
    const followerProfile = await UserProfile.findOne({ userId: followerId });

    const result = await Follower.findOneAndDelete({
      follower: followerProfile._id,
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
