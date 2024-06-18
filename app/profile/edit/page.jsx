// pages/profile-setup.js
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const EditProfile = () => {
  const { data: session } = useSession();

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/user-profile", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user.id,

        bio,
        fullName,
        location,
      }),
    });

    if (res.ok) {
      router.push("/");
    }
  };

  return (
    <section className="w-full max-w-full flex-start flex-col mt-20 mb-20">
      <h1 className="head_text text-left">
        <span className="blue_gradient">Lengkapi Profilemu</span>
      </h1>
      <p className="desc text-left max-w-md">bagikan bacotanmu dengan dunia.</p>

      <form
        onSubmit={handleSubmit}
        className=" w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <div className="my-10 space-y-8">
          <div className="flex flex-col">
            <label>Nama</label>
            <input
              className="form_input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Lokasi</label>
            <input
              className="form_input"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label>Bio</label>
            <textarea
              className="form_textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="flex justify-around">
          <button
            className="px-5 py-1.5 bg-black rounded-full text-white"
            type="submit"
          >
            Buat
          </button>
          <button
            className="px-5 py-1.5 bg-black rounded-full text-white"
            onClick={handleSignOut}
          >
            keluar
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditProfile;
