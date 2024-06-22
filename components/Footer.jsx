// components/Footer.js
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfo,
  faSignOutAlt,
  faMailBulk,
  faBell,
  faCommenting,
  faSearch,
  faPersonCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import fetcher from "@utils/fetcher";
import useSWR from "swr";

const Footer = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const hideNavAndFooter = ["/login", "/register", "/profile-setup"].includes(
    pathname
  );
  const [unreadCount, setUnreadCount] = useState();

  const [isNavVisible, setIsNavVisible] = useState(true);

  const { data, mutate: mutateUnread } = useSWR(
    `/api/notif/unread/${session?.user?.id}`,
    fetcher,
    {
      refreshInterval: 10000,
      refreshWhenHidden: false,
      shouldRetryOnError: true,
    }
  );

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos < 20;
    setIsNavVisible(visible);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (pathname.includes("/notification"))
      setUnreadCount({ ...data, unreadOtherCount: 0 });

    if (pathname.includes("/chat/"))
      setUnreadCount({ ...data, unreadMessageCount: 0 });
  }, [pathname]);

  useEffect(() => {
    setUnreadCount(data);
  }, [data]);

  if (hideNavAndFooter || pathname.includes("/chat/")) return;

  return (
    <footer>
      {!pathname.includes("/create-prompt") &&
        !pathname.includes("/update-prompt") &&
        !pathname.includes("/profile/edit") && (
          <div
            className={`p-2 sm:hidden fixed ${
              !isNavVisible ? "opacity-50" : ""
            } bottom-14  right-3  text-white py-4 flex justify-end transition-all w-fit ${
              session?.user
                ? ""
                : "transform translate-y-full opacity-0 duration-500"
            }`}
          >
            {pathname.includes("/chat") ? (
              <Link href="/chat/search">
                <div
                  className={`text-blue-400 hover:text-blue-200 transition-colors duration-300 ${
                    session?.user
                      ? ""
                      : "transform translate-y-full opacity-0 duration-500"
                  }`}
                >
                  <FontAwesomeIcon icon={faPersonCirclePlus} size="3x" />
                </div>
              </Link>
            ) : (
              <Link href="/create-prompt">
                <div
                  className={`text-blue-400 hover:text-blue-200 transition-colors duration-300 ${
                    session?.user
                      ? ""
                      : "transform translate-y-full opacity-0 duration-500"
                  }`}
                >
                  <FontAwesomeIcon icon={faCommenting} size="3x" />
                </div>
              </Link>
            )}
          </div>
        )}
      <div
        className={`p-2 sm:hidden fixed ${
          !isNavVisible ? "opacity-50" : ""
        } bottom-0 left-0 right-0 bg-black text-white py-4 flex justify-around transition-all ${
          session?.user
            ? ""
            : "transform translate-y-full opacity-0 duration-500"
        }`}
      >
        <Link href="/">
          <div className="text-gray-300 hover:text-white transition-colors duration-300">
            <FontAwesomeIcon icon={faHome} size="xl" />
          </div>
        </Link>
        <Link href="/search">
          <div className="text-gray-300 hover:text-white transition-colors duration-300">
            <FontAwesomeIcon icon={faSearch} size="xl" />
          </div>
        </Link>
        <Link href="/notification">
          <div className="relative text-gray-300 hover:text-white transition-colors duration-300">
            <FontAwesomeIcon icon={faBell} size="xl" />
            {unreadCount?.unreadOtherCount > 0 &&
              !pathname.includes("/notification") && (
                <span className="absolute top-1 right-4 bg-red-500 text-white text-[12px] rounded-full h-4 w-4 flex items-center font-satoshi justify-center">
                  {unreadCount.unreadOtherCount}
                </span>
              )}
          </div>
        </Link>
        <Link href="/home">
          <div className="text-gray-300 hover:text-white transition-colors duration-300">
            <FontAwesomeIcon icon={faInfo} size="xl" />
          </div>
        </Link>
        <Link href="/chat">
          <div className="relative text-gray-300 hover:text-white transition-colors duration-300">
            <FontAwesomeIcon icon={faMailBulk} size="xl" />
            {unreadCount?.unreadMessageCount > 0 &&
              !pathname.includes("/notification") && (
                <span className="absolute top-1 right-4 bg-red-500 text-white text-[12px] rounded-full h-4 w-4 flex items-center font-satoshi justify-center">
                  {unreadCount?.unreadMessageCount}
                </span>
              )}
          </div>
        </Link>
        {session?.user && (
          <div
            onClick={signOut}
            className="text-gray-300 hover:text-white transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
