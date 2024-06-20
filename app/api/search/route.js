import User from "@models/user";
import { connectToDB } from "@utils/database";

export const dynamic = "force-dynamic";
export const POST = async (request) => {
  const { query, page = 1, limit = 10 } = await request.json();

  try {
    await connectToDB();

    const regex = new RegExp(query, "i");
    const users = await User.find({
      $or: [{ username: regex }, { fullName: regex }],
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalUserCount = await User.countDocuments({
      $or: [{ username: regex }, { fullName: regex }],
    });

    return new Response(
      JSON.stringify({ users, totalPages: Math.ceil(totalUserCount / limit) }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to search users", error);
    return new Response("Failed to search users", { status: 500 });
  }
};
