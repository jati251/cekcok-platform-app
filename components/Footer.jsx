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
} from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const hideNavAndFooter = ["/login", "/register", "/profile-setup"].includes(
    pathname
  );

  const [isNavVisible, setIsNavVisible] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos < 20;
    setIsNavVisible(visible);
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`/api/notif/unread/${session.user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch unread notification count");
      }
      const data = await response.json();
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread notification count:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUnreadCount();
    }
  }, [session?.user]);

  useEffect(() => {
    if (pathname.includes("/notification")) setUnreadCount(0);
  }, [pathname]);

  if (hideNavAndFooter || pathname.includes("/chat/")) return;

  return (
    <footer>
      <div
        className={`p-2 sm:hidden fixed ${
          !isNavVisible ? "opacity-50" : ""
        } bottom-14  right-3  text-white py-4 flex justify-end transition-all w-fit ${
          session?.user
            ? ""
            : "transform translate-y-full opacity-0 duration-500"
        }`}
      >
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
      </div>
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
            {unreadCount > 0 && (
              <span className="absolute top-1 right-4 bg-red-500 text-white text-[12px] rounded-full h-4 w-4 flex items-center font-satoshi justify-center">
                {unreadCount}
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
          <div className="text-gray-300 hover:text-white transition-colors duration-300">
            <FontAwesomeIcon icon={faMailBulk} size="xl" />
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
