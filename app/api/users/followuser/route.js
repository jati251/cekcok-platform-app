// followUser.js
import Follower from "@models/follower";
import UserProfile from "@models/profile";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  const { followerId, followingId } = await request.json();
  try {
    await connectToDB();

    const followerProfile = await UserProfile.findOne({ userId: followerId });

    if (!followerProfile || !followingId) {
      return new Response("Profiles not found", { status: 404 });
    }

    const existingFollow = await Follower.findOne({
      follower: followerProfile._id,
      following: followingId,
    });

    if (existingFollow) {
      return new Response("Already following", { status: 400 });
    }

    const newFollower = new Follower({
      follower: followerProfile._id,
      following: followingId,
    });
    await newFollower.save();

    return new Response("Followed successfully", { status: 200 });
  } catch (error) {
    console.error("Failed to follow user", error);
    return new Response("Failed to follow user", { status: 500 });
  }
};
