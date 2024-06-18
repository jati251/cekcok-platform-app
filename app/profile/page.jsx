"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";
import Image from "next/image";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDarkModeContext } from "@app/context/DarkModeProvider";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { isDarkMode } = useDarkModeContext();
  const [myPosts, setMyPosts] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const response = await fetch(`/api/users/profile/${session?.user.id}`);
    const responsePosts = await fetch(`/api/users/${session?.user.id}/posts`);
    const dataPosts = await responsePosts.json();
    const data = await response.json();
    setMyPosts(dataPosts);
    setProfile(data);
    setLoading(false);
  };

  useEffect(() => {
    if (session?.user.id) {
      setLoading(true);
      fetchProfile();
    }
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Apakah kamu yakin mau ngapus bacotan ini?");

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  const { status } = useSession();
  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  return (
    <div className="px-4 w-full">
      <div className=" flex justify-start w-full mt-4 ">
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
      </div>
      <div className="absolute top-12 left-0 w-full h-[22vh]">
        {!profile.background || profile.background === "" ? (
          <div className="w-full h-[22vh] bg-gray-800"></div>
        ) : (
          <Image
            src={profile?.background}
            fill
            style={{ objectFit: "cover" }}
            alt="Background"
          />
        )}
      </div>
      <Profile
        isDarkMode={isDarkMode}
        data={myPosts}
        profile={profile}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
};

export default MyProfile;
