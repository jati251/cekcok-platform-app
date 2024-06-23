// Adjust the import path as necessary
import User from "@models/user";
import { connectToDB } from "@utils/database"; // Ensure you have a utility to connect to the database

export const GET = async () => {
  try {
    await connectToDB();

    const result = await User.updateMany(
      { usernameUpdateAt: { $exists: false } },
      [{ $set: { usernameUpdateAt: "$createdAt" } }]
    );

    return new Response("Successfully updated profile", { status: 200 });
  } catch (error) {
    console.error("Error updating users:", error);
    return new Response("Failed to update", { status: 500 });
  }
};
