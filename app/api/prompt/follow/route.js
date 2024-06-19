// fetchFollowedPosts.js
import Prompt from "@models/prompt";
import Follower from "@models/follower";
import { connectToDB } from "@utils/database";
import UserProfile from "@models/profile";

export const POST = async (request) => {
  const { userId, page = 1, limit = 10 } = await request.json();

  try {
    await connectToDB();

    const userProfile = await UserProfile.findOne({ userId }).select("_id");
    if (!userProfile) {
      return new Response("User profile not found", { status: 404 });
    }

    // Find all the profiles the current user is following
    const followedProfiles = await Follower.find({
      follower: userProfile._id,
    }).select("following");
    const followedProfileIds = followedProfiles.map((f) => f.following);

    // Find corresponding user IDs for these profile IDs
    const followedUsers = await UserProfile.find({
      _id: { $in: followedProfileIds },
    }).select("userId");
    const followedUserIds = followedUsers.map((profile) => profile.userId);

    // Fetch prompts from the followed users
    const count = await Prompt.countDocuments({
      creator: { $in: followedUserIds },
    });
    const prompts = await Prompt.find({ creator: { $in: followedUserIds } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("creator");

    return new Response(
      JSON.stringify({ prompts, totalPages: Math.ceil(count / limit) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch followed users' posts", error);
    return new Response("Failed to fetch followed users' posts", {
      status: 500,
    });
  }
};
