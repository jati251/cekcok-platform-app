// pages/api/profile-setup.js

import Follower from "@models/follower";
import Profile from "@models/profile";
import { connectToDB } from "@utils/database";

export const POST = async (request, { params }) => {
  try {
    await connectToDB();
    const { currentUser } = await request.json();

    const profile = await Profile.findOne({ userId: params.id })
      .select("-followers -following")
      .populate("userId");

    const currentProfile = await Profile.findOne({
      userId: currentUser,
    }).select("-followers -following");

    const followerCount = await Follower.countDocuments({
      following: profile._id,
    });

    const followingCount = await Follower.countDocuments({
      follower: profile._id,
    });

    const isFollowing = currentUser
      ? await Follower.exists({
          follower: currentProfile._id,
          following: profile._id,
        })
      : false;

    const profileWithCounts = {
      ...profile.toObject(),
      followerCount,
      followingCount,
      isFollowing,
    };

    return new Response(JSON.stringify(profileWithCounts), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch profile created by user", {
      status: 500,
    });
  }
};
