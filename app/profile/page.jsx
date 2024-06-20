"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";
import Image from "next/image";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import { debounce } from "@utils/helper";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { isDarkMode } = useDarkModeContext();
  const [myPosts, setMyPosts] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { status } = useSession();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const responsePosts = await fetch(
        `/api/users/${session?.user.id}/posts`,
        {
          method: "POST",
          body: JSON.stringify({
            page,
            limit: 10,
            userId: session?.user.id,
          }),
        }
      );
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
        if (myPosts.length === 0) setMyPosts(dataPosts.prompts);
        else setMyPosts((prevPosts) => [...prevPosts, ...dataPosts.prompts]);
        setHasMore(dataPosts.prompts.length > 0);
      } else {
        setHasMore(false);
      }

      setTotalPage(dataPosts.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      if (profile._id) setLoading(false);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/profile/${session?.user.id}`, {
        method: "POST",
        body: JSON.stringify({
          currentUser: null,
        }),
      });

      const data = await response.json();

      setProfile(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

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
    if (session?.user.id) {
      if ((!loading && page <= totalPage) || (myPosts.length === 0 && !loading))
        fetchPosts();
    }
  }, [session?.user.id, page]);

  useEffect(() => {
    if (status !== "loading") fetchProfile();
    if (status === "unauthenticated") handleBack();
  }, [status]);

  useEffect(() => {
    const debounceScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debounceScroll);
    return () => window.removeEventListener("scroll", debounceScroll);
  }, [handleScroll]);

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
