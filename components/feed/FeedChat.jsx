"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Loading from "@app/profile/loading";
import { useIsMobile } from "@utils/hooks";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import NotifCard from "../NotifCard";
import { useRouter } from "next/navigation";
import { debounce } from "@utils/helper";
import { BulkUserSkeleton } from "@components/Skeletons/BulkUser";

const ChatCardList = ({ data, status, isDarkMode, setNotif }) => {
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

const FeedChat = () => {
  const router = useRouter();
  const [allNotif, setAllNotif] = useState([]);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { isDarkMode } = useDarkModeContext();
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async (val) => {
    setLoading(true);
    try {
      const response = await fetch("/api/messages/chats", {
        method: "POST",
        body: JSON.stringify({
          userId: session.user.id,
          page: val ? 1 : page,
          limit: 15,
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
    if (!loading && page <= totalPage && status === "authenticated") {
      fetchNotifications();
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
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  return (
    <section className="feed ">
      {loading && allNotif.length === 0 && <BulkUserSkeleton />}

      <ChatCardList isDarkMode={isDarkMode} data={allNotif} status={loading} />
    </section>
  );
};

export default FeedChat;
