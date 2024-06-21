"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { PromptSkeleton } from "../Skeletons/PromptCardSkeleton";
import Loading from "@app/profile/loading";
import { useIsMobile } from "@utils/hooks";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import NotifCard from "../NotifCard";
import { useRouter } from "next/navigation";
import { debounce } from "@utils/helper";

const NotifCardList = ({ data, status, isDarkMode, setNotif }) => {
  return (
    <div className={`mb-16 ${useIsMobile() ? "w-full" : "prompt_layout"}`}>
      {data.map((notif, index) => (
        <NotifCard
          key={`${notif._id}_${index}`}
          notif={notif}
          setNotif={setNotif}
        />
      ))}
      {status && <Loading isDarkMode={isDarkMode} />}
    </div>
  );
};

const FeedNotif = () => {
  const router = useRouter();
  const [allNotif, setAllNotif] = useState([]);
  const [tab, setTab] = useState("semua");
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { isDarkMode } = useDarkModeContext();
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (val) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notif/${session?.user.id}`, {
        method: "POST",
        body: JSON.stringify({
          page: val ? 1 : page,
          limit: 10,
          userId: session?.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch notif");
      }
      const data = await response.json();

      if (data?.notif?.length > 0) {
        if (allNotif.length === 0) setAllNotif(data.notif);
        else setAllNotif((prevPosts) => [...prevPosts, ...data.notif]);
        setHasMore(data.notif.length > 0);
      } else {
        setHasMore(false);
      }

      setTotalPage(data.totalPages);
    } catch (error) {
      console.error("Error fetching notif:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotificationsMentions = async (val) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/notif/${session?.user.id}/mention`, {
        method: "POST",
        body: JSON.stringify({
          page: val ? 1 : page,
          limit: 10,
          userId: session?.user.id,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch notif");
      }
      const data = await response.json();

      if (data?.notif?.length > 0) {
        if (allNotif.length === 0) setAllNotif(data.notif);
        else setAllNotif((prevPosts) => [...prevPosts, ...data.notif]);
        setHasMore(data.notif.length > 0);
      } else {
        setHasMore(false);
      }

      setTotalPage(data.totalPages);
    } catch (error) {
      console.error("Error fetching notif:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && page <= totalPage && page > 1 && status !== "loading") {
      if (tab === "semua") {
        fetchNotifications();
      } else {
        fetchNotificationsMentions();
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

  useEffect(() => {
    setAllNotif([]);
    setPage(1);
    setTotalPage(1);
    if (tab === "semua") {
      fetchNotifications(true);
    } else {
      fetchNotificationsMentions(true);
    }
  }, [tab]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  return (
    <section className="feed ">
      {session?.user && (
        <div
          className={`font-satoshi flex justify-around w-full text-center border-t  ${
            isDarkMode ? "border-[#2f3336]" : "border-[#e3e3e3]"
          }`}
        >
          <div
            onClick={() => {
              setTab("semua");
            }}
            className={` cursor-pointer flex justify-center  ${
              tab === "semua" ? "border-blue-500 border-b-4 " : "text-gray-500"
            } items-center py-4  w-full`}
          >
            <span>Semua</span>
          </div>
          <div
            onClick={() => {
              setTab("mentions");
            }}
            className={`cursor-pointer flex justify-center   ${
              tab === "mentions"
                ? "border-blue-500 border-b-4"
                : "text-gray-500"
            } items-center py-4  w-full`}
          >
            <span>Mentions</span>
          </div>
        </div>
      )}

      {loading && allNotif.length === 0 && (
        <div className="mb-16 prompt_layout w-full px-6">
          <PromptSkeleton />
          <PromptSkeleton />
          <PromptSkeleton />
          <PromptSkeleton />
          <PromptSkeleton />
        </div>
      )}

      <NotifCardList isDarkMode={isDarkMode} data={allNotif} status={loading} />
    </section>
  );
};

export default FeedNotif;
