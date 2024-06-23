// pages/api/profile-setup.js

import Profile from "@models/profile";
import User from "@models/user";
import { connectToDB } from "@utils/database";

export const POST = async (req) => {
  try {
    await connectToDB();
    const {
      fullName,
      bio,
      username,
      location,
      userId,
      image,
      background,
      status,
    } = await req.json();

    if (username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error("Username already exists!");
      }
    }

    // Prepare update fields
    const updateFields = { image, fullName, status };
    if (username) {
      updateFields.username = username;
      updateFields.usernameUpdateAt = new Date();
    }

    // Update the user if there are any fields to update
    if (Object.keys(updateFields).length > 0)
      await User.findOneAndUpdate({ _id: userId }, updateFields, { new: true });

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
