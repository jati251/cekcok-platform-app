// followUser.js
import Follower from "@models/follower";
import UserProfile from "@models/userProfile";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  const { followerId, followingId } = await request.json();

  try {
    await connectToDB();

    // Ensure both profiles exist
    const followerProfile = await UserProfile.findById(followerId);
    const followingProfile = await UserProfile.findById(followingId);

    if (!followerProfile || !followingProfile) {
      return new Response("Profiles not found", { status: 404 });
    }

    // Check if the follow relationship already exists
    const existingFollow = await Follower.findOne({
      follower: followerId,
      following: followingId,
    });

    if (existingFollow) {
      return new Response("Already following", { status: 400 });
    }

    // Create new follower relationship
    const newFollower = new Follower({
      follower: followerId,
      following: followingId,
    });
    await newFollower.save();

    return new Response("Followed successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to follow user", error);
    return new Response("Failed to follow user", { status: 500 });
  }
};
