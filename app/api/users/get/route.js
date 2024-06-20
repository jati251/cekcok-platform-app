import User from "@models/user";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
  const { userId } = await request.json();

  try {
    await connectToDB();

    const user = await User.findById(userId).select("fullName image");

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Failed to find users", error);
    return new Response("Failed to find users", { status: 500 });
  }
};
