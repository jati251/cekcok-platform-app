// pages/api/profile-setup.js

import Follower from "@models/follower";
import Profile from "@models/profile";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const profile = await Profile.findOne({ userId: params.id })
      .select("-followers -following")
      .populate("userId");

    // Count the number of followers
    const followerCount = await Follower.countDocuments({
      following: profile._id,
    });

    // Count the number of users this profile is following
    const followingCount = await Follower.countDocuments({
      follower: profile._id,
    });

    // Append counts to profile
    const profileWithCounts = {
      ...profile.toObject(), // Convert Mongoose document to plain object
      followerCount,
      followingCount,
    };

    return new Response(JSON.stringify(profileWithCounts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch profile created by user", {
      status: 500,
    });
  }
};
