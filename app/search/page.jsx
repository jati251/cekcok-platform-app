"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import Loading from "@app/profile/loading";
import { useDebounce, useIsMobile } from "@utils/hooks";
import { PromptSkeleton } from "@components/Skeletons/PromptCardSkeleton";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import CustomTab from "@components/tabs/CustomTab";
import { debounce } from "@utils/helper";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { UserSkeleton } from "@components/Skeletons/UserCardSkeleton";
import PromptCard from "@components/cards/PromptCard";
import UserCard from "@components/cards/UserCard";

const PromptCardList = ({ data, status, isDarkMode }) => {
  return (
    <div className={`mb-16 ${useIsMobile() ? "w-full" : "prompt_layout"}`}>
      {data.map((post, index) => (
        <PromptCard key={`${post._id}_${index}`} post={post} />
      ))}
      {status && <Loading isDarkMode={isDarkMode} />}
    </div>
  );
};

const UserCardList = ({ data }) => {
  return (
    <div className={`mb-16 ${useIsMobile() ? "w-full" : "prompt_layout"}`}>
      {data.map((user, index) => (
        <UserCard key={`${user._id}_${index}`} user={user} />
      ))}
    </div>
  );
};

export default function SearchPage() {
  const router = useRouter();
  const [allPosts, setAllPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [tab, setTab] = useState("user");
  const { data: session, status } = useSession();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debouncedQuery = useDebounce(searchText, 600);
  const { isDarkMode } = useDarkModeContext();

  const searchPosts = async (val) => {
    setLoading(true);
    try {
      const response = await fetch("/api/search/posts", {
        method: "POST",
        body: JSON.stringify({
          page: val ? 1 : page,
          limit: 10,
          query: searchText,
          tag: tab === "tag" && true,
        }),
      });

      const data = await response.json();

      if (session?.user) {
        const userId = session.user.id;
        data.prompts.forEach((post) => {
          const userInteraction = post.userInteractions.find(
            (interaction) => interaction.userId.toString() === userId
          );
          post.liked = userInteraction?.action === "like";
          post.hated = userInteraction?.action === "hate";
        });
      } else {
        data.prompts.forEach((post) => {
          post.liked = false;
          post.hated = false;
        });
      }

      if (data?.prompts.length > 0) {
        if (allPosts.length === 0 || val) setAllPosts(data.prompts);
        else setAllPosts((prevPosts) => [...prevPosts, ...data.prompts]);
        setHasMore(data.prompts.length > 0);
      } else {
        setHasMore(false);
      }

      setTotalPage(data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (val) => {
    setLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({
          query: searchText,
          page: val ? 1 : page,
          limit: 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user search results");
      }

      const data = await response.json();
      if (data?.users.length > 0) {
        if (allUsers.length === 0 || val) setAllUsers(data.users);
        else setAllUsers((prevUsers) => [...prevUsers, ...data.users]);
        setHasMore(data.users.length > 0);
      } else {
        setHasMore(false);
      }
      setTotalPage(data.totalPages);
    } catch (error) {
      console.error("Error searching users:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  //=======================================================

  useEffect(() => {
    if (debouncedQuery) {
      setTotalPage(1);
      setAllPosts([]);
      setAllUsers([]);
      switch (tab) {
        case "postingan":
          searchPosts(true);
          break;
        case "user":
          searchUsers(true);
          break;
        case "tag":
          searchPosts(true);
          break;
        default:
          break;
      }
    } else {
      setAllPosts([]);
      setAllUsers([]);
    }
  }, [debouncedQuery]);

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };
  //=======================================================

  // perscrollan

  useEffect(() => {
    if (!loading && page <= totalPage && page > 1 && status !== "loading") {
      if (tab === "postingan" || tab === "tag") {
        searchPosts();
      } else {
        searchUsers();
      }
    }
  }, [page]);

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
    const debounceScroll = debounce(handleScroll, 200);

    window.addEventListener("scroll", debounceScroll);
    return () => window.removeEventListener("scroll", debounceScroll);
  }, [handleScroll]);
  //=======================================================
  const resetFetch = () => {
    setAllPosts([]);
    setAllUsers([]);
    setPage(1);
    setTotalPage(1);
  };

  const handleClear = () => {
    setSearchText("");
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  if (status === "loading")
    return (
      <div className="min-w-screen min-h-screen flex items-center justify-center">
        <Loading isDarkMode={isDarkMode} />
      </div>
    );

  return (
    <section className="w-full flex-center flex-col mt-20 mb-20">
      <div className="feed ">
        <form className="relative w-full px-8 flex-center mb-6">
          <div className="relative w-full">
            <FontAwesomeIcon
              icon={faSearch}
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            />
            <input
              type="text"
              placeholder="Cari berdasarkan tag atau username"
              value={searchText}
              onChange={handleChange}
              required
              className={`peer ${
                isDarkMode ? "bg-[#0b0b0b] search_input_dark" : "search_input"
              }`}
              style={{ paddingLeft: "2.5rem" }}
            />
            {searchText && (
              <FontAwesomeIcon
                icon={faTimes}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={handleClear}
              />
            )}
          </div>
        </form>

        {session?.user && (
          <div
            className={`font-satoshi flex justify-around w-full text-center border-t  ${
              isDarkMode ? "border-[#2f3336]" : "border-[#e3e3e3]"
            }`}
          >
            <CustomTab
              tab={tab}
              tabFor="user"
              onClick={() => {
                setTab("user");
                resetFetch();
              }}
            />
            <CustomTab
              tab={tab}
              tabFor="postingan"
              onClick={() => {
                setTab("postingan");
                resetFetch();
              }}
            />
            <CustomTab
              tab={tab}
              tabFor="tag"
              onClick={() => {
                setTab("tag");
                resetFetch();
              }}
            />
          </div>
        )}

        {loading &&
          allPosts.length === 0 &&
          (tab === "postingan" || tab === "tag") && (
            <div className="mb-16 prompt_layout w-full px-6">
              <PromptSkeleton />
              <PromptSkeleton />
              <PromptSkeleton />
              <PromptSkeleton />
              <PromptSkeleton />
            </div>
          )}
        {loading && allUsers.length === 0 && tab === "user" && (
          <div className="mb-16 user_layout w-full px-6">
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
          </div>
        )}

        <UserCardList isDarkMode={isDarkMode} data={allUsers} />

        <PromptCardList
          isDarkMode={isDarkMode}
          data={allPosts}
          status={loading}
        />
      </div>
    </section>
  );
}
