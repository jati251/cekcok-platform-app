"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import Loading from "@app/profile/loading";
import { useDebounce, useIsMobile } from "@utils/hooks";
import { PromptSkeleton } from "@components/Skeletons/PromptCardSkeleton";
import PromptCard from "@components/PromptCard";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import CustomTab from "@components/tabs/CustomTab";
import { debounce } from "@utils/helper";
import { useRouter } from "next/navigation";

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

export default function SearchPage() {
  const router = useRouter();
  const [allPosts, setAllPosts] = useState([]);
  const [tab, setTab] = useState("user");
  const { data: session, status } = useSession();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debouncedQuery = useDebounce(searchText, 600);
  const { isDarkMode } = useDarkModeContext();

  const fetchPosts = async (val) => {
    setLoading(true);
    try {
      const response = await fetch("/api/search/posts", {
        method: "POST",
        body: JSON.stringify({
          page: val ? 1 : page,
          limit: 10,
          query: searchText,
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

  const fetchUsers = async () => {};

  //=======================================================

  useEffect(() => {
    if (debouncedQuery) {
      setTotalPage(1);
      setAllPosts([]);
      switch (tab) {
        case "postingan":
          fetchPosts(true);
          break;
        case "user":
          fetchUsers(true);
          break;
        default:
          break;
      }
    } else {
      setAllPosts([]);
    }
  }, [debouncedQuery]);

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };
  //=======================================================

  // perscrollan

  useEffect(() => {
    if (!loading && page <= totalPage && page > 1 && status !== "loading") {
      if (tab === "beranda") {
        fetchPosts();
      } else {
        fetchPostsFollow();
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
    setPage(1);
    setTotalPage(1);
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
          <input
            type="text"
            placeholder="Cari berdasarkan tag atau username"
            value={searchText}
            onChange={handleChange}
            required
            className={`search_input peer ${isDarkMode ? "bg-[#0b0b0b]" : ""}`}
          />
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
              tabFor="test"
              onClick={() => {
                setTab("test");
                resetFetch();
              }}
            />
          </div>
        )}

        {loading && allPosts.length === 0 && (
          <div className="mb-16 prompt_layout w-full px-6">
            <PromptSkeleton />
            <PromptSkeleton />
            <PromptSkeleton />
            <PromptSkeleton />
            <PromptSkeleton />
          </div>
        )}

        <PromptCardList
          isDarkMode={isDarkMode}
          data={allPosts}
          status={loading}
        />
      </div>
    </section>
  );
}
