// getFollowing.js
import Follower from "@models/follower";
import { connectToDB } from "@utils/database";

export const GET = async (request) => {
  const { userId } = request.query;

  try {
    await connectToDB();

    // Find all following
    const following = await Follower.find({ follower: userId }).populate(
      "following"
    );

    return new Response(JSON.stringify(following), { status: 200 });
  } catch (error) {
    console.error("Failed to fetch following", error);
    return new Response("Failed to fetch following", { status: 500 });
  }
};
