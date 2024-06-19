"use client";

import Feed from "@components/Feed";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status !== "loading")
    return (
      <section className="w-full flex-center flex-col mt-20 mb-20">
        <p className="desc text-center text-md">
          CekCok adalah platform sosial dimana kita bisa adu bacot satu sama
          lain.
        </p>

        <Feed />
      </section>
    );
}
