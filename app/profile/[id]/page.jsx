"use client";

import { useCallback, useEffect, useState } from "react";
import Profile from "@components/Profile";
import { useSession } from "next-auth/react";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { debounce } from "@utils/helper";
import Loading from "../loading";

const UserProfile = ({ params }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const { isDarkMode } = useDarkModeContext();
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchPosts = async () => {
    setLoadingPost(true);
    try {
      const responsePosts = await fetch(`/api/users/${params?.id}/posts`, {
        method: "POST",
        body: JSON.stringify({
          page,
          limit: 10,
          userId: params.id,
        }),
      });
      const dataPosts = await responsePosts.json();
      if (session?.user) {
        const userId = session.user.id;
        dataPosts.prompts.forEach((post) => {
          const userInteraction = post.userInteractions.find(
            (interaction) => interaction.userId.toString() === userId
          );
          post.liked = userInteraction?.action === "like";
          post.hated = userInteraction?.action === "hate";
        });
      } else {
        dataPosts.prompts.forEach((post) => {
          post.liked = false;
          post.hated = false;
        });
      }

      if (dataPosts.prompts.length > 0) {
        if (userPosts.length === 0) setUserPosts(dataPosts.prompts);
        else setUserPosts((prevPosts) => [...prevPosts, ...dataPosts.prompts]);
        setHasMore(dataPosts.prompts.length > 0);
      } else {
        setHasMore(false);
      }
      setTotalPage(dataPosts.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoadingPost(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/profile/${params?.id}`, {
        method: "POST",
        body: JSON.stringify({
          currentUser: session?.user.id,
        }),
      });

      const data = await response.json();

      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (page <= totalPage) fetchPosts();
  }, [page]);

  useEffect(() => {
    if (status !== "loading") fetchProfile();
  }, [status]);

  useEffect(() => {
    const debounceScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debounceScroll);
    return () => window.removeEventListener("scroll", debounceScroll);
  }, [handleScroll]);

  if (status === "loading")
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center">
        <Loading isDarkMode={isDarkMode} />
      </div>
    );

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
          <div className=" w-full h-[22vh] bg-gray-800"></div>
        ) : (
          <Image
            src={profile?.background ?? ""}
            fill
            style={{ objectFit: "cover" }}
            alt="Background"
          />
        )}
      </div>

      <Profile
        fetchProfile={fetchProfile}
        isDarkMode={isDarkMode}
        profile={profile}
        data={userPosts}
        loading={loading}
        loadingPost={loadingPost}
      />
    </div>
  );
};

export default UserProfile;
