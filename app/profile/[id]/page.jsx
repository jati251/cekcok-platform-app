"use client";

import { useEffect, useState } from "react";
import Profile from "@components/Profile";
import { useSession } from "next-auth/react";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";

const UserProfile = ({ params }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useDarkModeContext();
  const router = useRouter();
  const { status } = useSession();

  const fetchProfile = async () => {
    const response = await fetch(`/api/users/profile/${params?.id}`);
    const responsePosts = await fetch(`/api/users/${params?.id}/posts`);
    const dataPosts = await responsePosts.json();
    if (session?.user) {
      const userId = session.user.id;
      dataPosts.forEach((post) => {
        const userInteraction = post.userInteractions.find(
          (interaction) => interaction.userId.toString() === userId
        );
        post.liked = userInteraction?.action === "like";
        post.hated = userInteraction?.action === "hate";
      });
    } else {
      dataPosts.forEach((post) => {
        post.liked = false;
        post.hated = false;
      });
    }
    const data = await response.json();

    setUserPosts(dataPosts);
    setProfile(data);
    setLoading(false);
  };

  const handleBack = () => {
    router.push("/");
  };

  useEffect(() => {
    if (params?.id) fetchProfile();
  }, [params.id]);

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
          <div className="animate-pulse w-full h-[22vh] bg-gray-800"></div>
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
        profile={profile}
        data={userPosts}
        loading={loading}
      />
    </div>
  );
};

export default UserProfile;
