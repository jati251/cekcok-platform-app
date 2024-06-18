"use client";

import Feed from "@components/Feed";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status !== "loading")
    return (
      <section className="w-full flex-center flex-col mt-20 mb-20">
        <h1 className="head_text text-center">
          Temu & Bagikan
          <br className="max-md:hidden" />
          <span className="text-sky-300 text-center"> Wadah Untuk Bacot</span>
        </h1>
        <p className="desc text-center text-md">
          CekCok adalah platform sosial dimana kita bisa adu bacot satu sama
          lain.
        </p>

        <Feed />
      </section>
    );
}
