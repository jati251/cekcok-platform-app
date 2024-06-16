// components/Footer.js
"use client";

import React from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faComment,
  faSignOutAlt,
  faPlusCircle, // FontAwesome icon for create post
} from "@fortawesome/free-solid-svg-icons";
import { signOut, useSession } from "next-auth/react";

const Footer = () => {
  const { data: session } = useSession();
  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 bg-black text-white py-4 flex justify-around transition-all ${
        session?.user
          ? ""
          : "transform translate-y-full opacity-0 duration-500"
      }`}
    >
      <Link href="/">
        <div className="text-gray-300 hover:text-white transition-colors duration-300">
          <FontAwesomeIcon icon={faHome} size="lg" />
        </div>
      </Link>
      <Link href="/create-prompt">
        <div className="text-gray-300 hover:text-white transition-colors duration-300">
          <FontAwesomeIcon icon={faPlusCircle} size="lg" />
        </div>
      </Link>
      <Link href="/chat">
        <div className="text-gray-300 hover:text-white transition-colors duration-300">
          <FontAwesomeIcon icon={faComment} size="lg" />
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
