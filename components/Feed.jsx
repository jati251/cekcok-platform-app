"use client";

import { useState, useEffect, useCallback } from "react";
import PromptCard from "./PromptCard";
import { useSession } from "next-auth/react";
import { PromptSkeleton } from "./Skeletons/PromptCardSkeleton";
import Loading from "@app/profile/loading";
import { useIsMobile } from "@utils/hooks";
import { useDarkModeContext } from "@app/context/DarkModeProvider";

const PromptCardList = ({ data, handleTagClick, status, isDarkMode }) => {
  return (
    <div className={`mb-16 ${useIsMobile() ? "w-full" : "prompt_layout"}`}>
      {data.map((post, index) => (
        <PromptCard
          key={`${post._id}_${index}`}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
      {status && <Loading isDarkMode={isDarkMode} />}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [tab, setTab] = useState("beranda");
  const { data: session, status } = useSession();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);
  const { isDarkMode } = useDarkModeContext();

  const fetchPosts = async (val) => {
    setLoading(true);
    try {
      const response = await fetch("/api/prompt", {
        method: "POST",
        body: JSON.stringify({
          page: val ? 1 : page,
          limit: 10,
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

      if (data?.prompts?.length > 0) {
        if (allPosts.length === 0) setAllPosts(data.prompts);
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

  const fetchPostsFollow = async (val) => {
    setLoading(true);
    try {
      const response = await fetch("/api/prompt/follow", {
        method: "POST",
        body: JSON.stringify({
          page: val ? 1 : page,
          limit: 10,
          userId: session?.user.id,
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

      if (data?.prompts?.length > 0) {
        if (allPosts.length === 0) setAllPosts(data.prompts);
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

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return allPosts.filter(
      (item) =>
        regex.test(item?.creator?.username ?? item?.author?.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  useEffect(() => {
    if (
      (!loading && page <= totalPage && status !== "loading") ||
      (allPosts.length === 0 && !loading)
    ) {
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

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  useEffect(() => {
    setAllPosts([]);
    setPage(1);
    setTotalPage(1);
    if (tab === "beranda") {
      fetchPosts(true);
    } else {
      fetchPostsFollow(true);
    }
  }, [tab]);

  return (
    <section className="feed ">
      <form className="relative w-full px-8 flex-center mb-6">
        <input
          type="text"
          placeholder="Cari berdasarkan tag atau username"
          value={searchText}
          onChange={handleSearchChange}
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
          <div
            onClick={() => {
              setTab("beranda");
            }}
            className={` cursor-pointer flex justify-center  ${
              tab === "beranda"
                ? "border-blue-500 border-b-4 "
                : "text-gray-500"
            } items-center py-4  w-full`}
          >
            <span className="  ">Beranda</span>
          </div>
          <div
            onClick={() => {
              setTab("following");
            }}
            className={`cursor-pointer flex justify-center   ${
              tab === "following"
                ? "border-blue-500 border-b-4"
                : "text-gray-500"
            } items-center py-4  w-full`}
          >
            <span className="  ">Following</span>
          </div>
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

      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList
          isDarkMode={isDarkMode}
          data={allPosts}
          status={loading}
          handleTagClick={handleTagClick}
        />
      )}
    </section>
  );
};

export default Feed;
