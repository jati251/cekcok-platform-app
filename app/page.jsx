"use client";

import Feed from "@components/Feed";
import { useSession } from "next-auth/react";
import Loading from "./profile/loading";
import { useDarkModeContext } from "./context/DarkModeProvider";

export default function Home() {
  const { data: session, status } = useSession();
  const { isDarkMode } = useDarkModeContext();

  if (status !== "loading")
    return (
      <section className="w-full flex-center flex-col mt-20 mb-20">
        {!session?.user && (
          <p className="desc text-center text-md">
            CekCok adalah platform sosial dimana kita bisa adu bacot satu sama
            lain.
          </p>
        )}

        <Feed />
      </section>
    );

  return (
    <div className="min-w-screen min-h-screen flex items-center justify-center">
      <Loading isDarkMode={isDarkMode} />
    </div>
  );
}
