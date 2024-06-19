// pages/api/profile-setup.js

import Profile from "@models/profile";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const POST = async (req) => {
  try {
    await connectToDB();
    const { fullName, bio, location, userId, image, background } =
      await req.json();

    if (image) {
      await User.findOneAndUpdate(
        { _id: userId },
        { image, fullName },
        { new: true }
      );
    }

    let profile = await Profile.findOne({ userId });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { userId },
        { bio, location, background },
        { new: true }
      );
    }

    return new Response("Successfully updated profile", { status: 200 });
  } catch (error) {
    console.error("Error saving profile:", error.message);
    return new Response("Internal server error", { status: 500 });
  }
};
