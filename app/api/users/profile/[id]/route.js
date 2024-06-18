// pages/api/profile-setup.js

import Profile from "@models/profile";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
  try {
    await connectToDB();
    const profile = await Profile.findOne({ userId: params.id }).populate(
      "userId"
    );

    return new Response(JSON.stringify(profile), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch profile created by user", {
      status: 500,
    });
  }
};
