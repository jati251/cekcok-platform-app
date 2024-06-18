// pages/profile-setup.js
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  faArrowLeft,
  faCalendar,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileImage from "@components/profile/ProfileImage";
import CustomInput from "@components/input/CustomInput";
import CustomTextArea from "@components/input/CustomTextArea";
import ProfileBackground from "@components/profile/ProfileBackground";
import { useDarkModeContext } from "@app/context/DarkModeProvider";

const EditProfile = () => {
  const { data: session, status } = useSession();
  const { isDarkMode } = useDarkModeContext();
  const [profile, setProfile] = useState({
    userId: {
      image: "",
    },
    fullName: "",
    background: "",
    bio: "",
    location: "",
    interests: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const response = await fetch(`/api/users/profile/${session?.user.id}`);
    const data = await response.json();
    setProfile(data);
    setLoading(false);
  };
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { bio, fullName, location, background } = profile;
    const res = await fetch("/api/users/profile/edit", {
      method: "POST",
      body: JSON.stringify({
        userId: session.user.id,
        bio,
        fullName,
        location,
        background,
        image: profile.userId.image,
      }),
    });

    if (res.ok) {
      router.push("/profile");
    }
  };

  const handleImage = (val) => {
    setProfile({ ...profile, userId: { ...profile.userId, image: val } });
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    if (session?.user.id) {
      setLoading(true);
      fetchProfile();
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  if (status !== "loading")
    return (
      <section className="w-full max-w-fullflex-start flex-col mb-20 px-3">
        <form
          onSubmit={handleSubmit}
          className=" w-full max-w-2xl flex flex-col gap-7 glassmorphism"
        >
          <div className=" flex justify-between w-full mt-4 px-4">
            <button
              className={`flex font-satoshi items-center gap-2 ${
                isDarkMode
                  ? "text-gray-200 hover:text-gray-300 "
                  : "text-gray-700 hover:text-gray-800 "
              } transition-colors duration-200`}
              onClick={handleBack}
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              <span>Kembali</span>
            </button>
            <button
              className={`cursor-pointer px-5 py-1.5 rounded-full ${
                !isDarkMode ? "black_btn" : "white_btn"
              }`}
              type="submit"
            >
              Simpan
            </button>
          </div>
          <div className="w-full">
            <ProfileBackground
              onImageChange={(val) =>
                setProfile({ ...profile, background: val })
              }
              loading={loading}
              src={profile?.background}
            />
          </div>
          {loading ? (
            <div className=" flex space-x-4 mx-4 mt-[15vh]">
              <div className="rounded-full bg-gray-500 h-[9vh] w-[9vh]"></div>
            </div>
          ) : (
            <div className=" mt-[15vh]">
              <ProfileImage
                onImageChange={handleImage}
                loading={loading}
                src={profile?.userId.image}
              />
            </div>
          )}
          <div className="my-6 space-y-8">
            <CustomInput
              isDarkMode={isDarkMode}
              label="Nama"
              value={profile?.fullName}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
            />
            <CustomTextArea
              isDarkMode={isDarkMode}
              maxLength={160}
              label="Bio"
              value={profile?.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            />
            <CustomInput
              isDarkMode={isDarkMode}
              label="Lokasi"
              value={profile?.location}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
            />
          </div>
        </form>
      </section>
    );
};

export default EditProfile;
