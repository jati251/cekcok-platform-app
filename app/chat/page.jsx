"use client";

import { useSession } from "next-auth/react";
import Loading from "@app/profile/loading";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import FeedChat from "@components/feed/FeedChat";

export default function ChatMain() {
  const { status } = useSession();
  const { isDarkMode } = useDarkModeContext();

  if (status !== "loading")
    return (
      <section className="w-full flex-center flex-col mt-20 mb-20">
        <FeedChat />
      </section>
    );

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      <Loading isDarkMode={isDarkMode} />
    </div>
  );
}
