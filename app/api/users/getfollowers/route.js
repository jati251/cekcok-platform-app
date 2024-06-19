// getFollowers.js
import Follower from "@models/follower";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
  const { userId } = request.query;

  try {
    await connectToDB();

    // Find all followers
    const followers = await Follower.find({ following: userId }).populate(
      "follower"
    );

    return new Response(JSON.stringify(followers), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch followers", error);
    return new Response("Failed to fetch followers", { status: 500 });
  }
};
