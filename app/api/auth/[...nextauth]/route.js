import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectToDB } from "@utils/database";
import UserProfile from "@models/profile";
import { formatEmail } from "@utils/helper";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();
      session.user.image = sessionUser.image;
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();

        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          let user = await User.create({
            email: profile.email,
            fullName: profile.name,
            username: formatEmail(profile.email.toLowerCase()),
            image: profile.picture,
          });

          await UserProfile.create({
            userId: user._id,
          });
        }

        return true;
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
