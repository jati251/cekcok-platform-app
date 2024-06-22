"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import Loading from "@app/profile/loading";
import { useDebounce, useIsMobile } from "@utils/hooks";

import { useDarkModeContext } from "@app/context/DarkModeProvider";

import { debounce } from "@utils/helper";
import { useRouter } from "next/navigation";
import UserCard from "@components/UserCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSearch,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { UserSkeleton } from "@components/Skeletons/UserCardSkeleton";

const UserCardList = ({ data, selected, setSelected }) => {
  return (
    <div className={`mb-16 ${useIsMobile() ? "w-full" : "prompt_layout"}`}>
      {data.map((user, index) => (
        <UserCard
          selected={selected}
          setSelected={setSelected}
          key={`${user._id}_${index}`}
          user={user}
        />
      ))}
    </div>
  );
};

export default function ChatSearchPage() {
  const router = useRouter();
  const [allUsers, setAllUsers] = useState([]);

  const { status } = useSession();
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("");

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const debouncedQuery = useDebounce(searchText, 600);
  const { isDarkMode } = useDarkModeContext();

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
      setAllUsers([]);
      searchUsers(true);
    } else {
      setAllUsers([]);
    }
  }, [debouncedQuery]);

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };
  //=======================================================

  // perscrollan

  const handleChat = () => {
    router.push(`/chat/${selected}`);
  };

  useEffect(() => {
    if (!loading && page <= totalPage && page > 1 && status !== "loading") {
      searchUsers();
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

  const handleClear = () => {
    setSearchText("");
  };

  const handleBack = () => {
    router.back();
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
    <section className="w-full flex-center flex-col mb-10">
      <div className="feed ">
        <div className="flex justify-between w-full px-6 mb-5 gap-4 py-4">
          <button
            className={`flex font-satoshi items-center gap-2 ${
              isDarkMode
                ? "text-gray-200 hover:text-gray-300 "
                : "text-gray-700 hover:text-gray-800 "
            } transition-colors duration-200`}
            onClick={handleBack}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span className="text-lg">Kembali</span>
          </button>

          <button
            onClick={handleChat}
            className={`px-5 py-1.5 text-lg rounded-full ${
              !isDarkMode ? "black_btn" : "white_btn"
            }`}
          >
            <span> Mulai Chat</span>
          </button>
        </div>

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
              placeholder="Cari user"
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

        {loading && allUsers.length === 0 && (
          <div className="mb-16 user_layout w-full px-6">
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
          </div>
        )}

        <UserCardList
          selected={selected}
          isDarkMode={isDarkMode}
          data={allUsers}
          setSelected={setSelected}
        />
      </div>
    </section>
  );
}
