// components/Footer.js
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faComment,
  faInfo,
  faSignOutAlt,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const hideNavAndFooter = ["/login", "/register", "/profile-setup"].includes(
    pathname
  );

  if (hideNavAndFooter) return;

  const [isNavVisible, setIsNavVisible] = useState(true);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos < 20;
    setIsNavVisible(visible);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={`p-2 sm:hidden fixed ${
        !isNavVisible ? "opacity-50" : ""
      } bottom-0 left-0 right-0 bg-black text-white py-4 flex justify-around transition-all ${
        session?.user ? "" : "transform translate-y-full opacity-0 duration-500"
      }`}
    >
      <Link href="/">
        <div className="text-gray-300 hover:text-white transition-colors duration-300">
          <FontAwesomeIcon icon={faHome} size="xl" />
        </div>
      </Link>
      <Link href="/create-prompt">
        <div className="text-gray-300 hover:text-white transition-colors duration-300">
          <FontAwesomeIcon icon={faPlusCircle} size="xl" />
        </div>
      </Link>
      <Link href="/home">
        <div className="text-gray-300 hover:text-white transition-colors duration-300">
          <FontAwesomeIcon icon={faInfo} size="xl" />
        </div>
      </Link>
      <Link href="/chat">
        <div className="text-gray-300 hover:text-white transition-colors duration-300">
          <FontAwesomeIcon icon={faComment} size="xl" />
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
    </footer>
  );
};

export default Footer;
