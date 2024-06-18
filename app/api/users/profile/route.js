// pages/api/profile-setup.js

import Profile from "@models/profile";
import { connectToDB } from "@utils/database";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { fullName, bio, location, userId, interests } = await req.json();

    let profile = await Profile.findOne({ userId });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { userId },
        { fullName, bio, location, interests, background },
        { new: true }
      );
    }

    return new Response("Successfully updated profile", { status: 200 });
  } catch (error) {
    console.error("Error saving profile:", error.message);
    return new Response("Internal server error", { status: 500 });
  }
};

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const profile = await Profile.find({ userId: params.id }).populate(
      "userId"
    );

    return new Response(JSON.stringify(profile), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch profile created by user", {
      status: 500,
    });
  }
};
