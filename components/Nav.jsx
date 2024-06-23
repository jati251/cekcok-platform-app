"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faMoon,
  faSun,
  faUser,
  faUserEdit,
} from "@fortawesome/free-solid-svg-icons";
import { useDarkModeContext } from "@app/context/DarkModeProvider";

const Nav = () => {
  const pathname = usePathname();

  const hideNavAndFooter = ["/login", "/register"].includes(pathname);

  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const { isDarkMode, toggleDarkMode } = useDarkModeContext();

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos < 20;
    if (visible) setToggleDropdown(false);
    setIsNavVisible(visible);
  };

  useEffect(() => {
    (async () => {
      const res = await getProviders();
      setProviders(res);
    })();
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  if (
    hideNavAndFooter ||
    pathname.includes("/profile") ||
    pathname.includes("/chat/")
  )
    return;
  if (status !== "loading")
    return (
      <nav
        className={`fixed top-0 left-0 right-0 p-4 z-50 flex-between w-full mb-16 pt-1 ${
          isDarkMode ? "" : "bg-gradient-to-b from-gray-500"
        } transition-all  ${
          isNavVisible
            ? ""
            : "transform -translate-y-full opacity-0 duration-500"
        }`}
      >
        <Link href="/" className="flex gap-2 flex-center">
          <Image
            priority={true}
            src="/assets/images/logo.png"
            alt="logo"
            width={70}
            height={70}
            className="object-contain cursor-pointer"
          />
          <p className="logo_text">CekCok</p>
        </Link>

        {/* Desktop Navigation */}
        <div className="sm:flex hidden">
          {session?.user ? (
            <div className="flex gap-3 md:gap-5">
              <Link href="/create-prompt" className="black_btn">
                Buat Bacotan Baru
              </Link>

              <button type="button" onClick={signOut} className="outline_btn">
                Keluar
              </button>

              <Link href="/profile">
                <Image
                  src={session?.user.image}
                  width={37}
                  height={37}
                  className="rounded-full"
                  alt="profile"
                />
              </Link>
            </div>
          ) : (
            <>
              {providers &&
                Object.values(providers).map((provider) => (
                  <button
                    type="button"
                    key={provider.name}
                    onClick={() => {
                      signIn(provider.id);
                    }}
                    className="black_btn"
                  >
                    Masuk
                  </button>
                ))}
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden flex relative">
          {session?.user ? (
            <div className="flex">
              <Image
                src={session?.user.image}
                width={40}
                height={40}
                className="rounded-full cursor-pointer"
                alt="profile"
                onClick={() => setToggleDropdown(!toggleDropdown)}
              />

              {toggleDropdown && (
                <div
                  onClick={() => setToggleDropdown(!toggleDropdown)}
                  className={`fixed inset-0 z-50 p-2 flex justify-end ${
                    isDarkMode ? "bg-gray-900" : "bg-black"
                  } bg-opacity-50`}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`top-full mt-[7vh] w-full p-5 rounded-xl ${
                      isDarkMode ? "bg-black" : "bg-white"
                    } min-w-[210px] max-w-[240px] max-h-[300px] flex flex-col gap-3 justify-end items-end shadow-xl`}
                  >
                    <div className="flex flex-col items-end">
                      <span className="dropdown_link mb-1">
                        {session?.user?.fullName}
                      </span>
                      <span className="dropdown_link mb-1 text-sm text-gray-500">
                        @{session?.user?.username}
                      </span>
                    </div>
                    <div className="gap-2 flex items-center">
                      <Link
                        href="/profile"
                        className="dropdown_link "
                        onClick={(e) => {
                          e.stopPropagation();
                          setToggleDropdown(false);
                        }}
                      >
                        Profil Saya
                      </Link>
                      <FontAwesomeIcon icon={faUser} />
                    </div>

                    <div className="gap-2 flex items-center">
                      <Link
                        href="/create-prompt"
                        className="dropdown_link"
                        onClick={(e) => {
                          e.stopPropagation();
                          setToggleDropdown(false);
                        }}
                      >
                        Buat Bacotan Baru
                      </Link>
                      <FontAwesomeIcon icon={faFaceSmile} />
                    </div>
                    <div className="gap-2 flex items-center">
                      <Link
                        href="/profile/edit"
                        className="dropdown_link"
                        onClick={(e) => {
                          e.stopPropagation();
                          setToggleDropdown(false);
                        }}
                      >
                        Ubah Profile
                      </Link>
                      <FontAwesomeIcon icon={faUserEdit} />
                    </div>
                    <button
                      className="dropdown_link cursor-pointer "
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDarkMode(!isDarkMode);
                      }}
                    >
                      {isDarkMode ? " Mode Gelap" : " Mode terang"}{" "}
                      <FontAwesomeIcon icon={!isDarkMode ? faSun : faMoon} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setToggleDropdown(false);
                        signOut();
                      }}
                      className={`mt-5 w-full ${
                        !isDarkMode ? "black_btn" : "white_btn"
                      }`}
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {providers && status !== "loading" ? (
                Object.values(providers).map((provider) => (
                  <button
                    type="button"
                    key={provider.name}
                    onClick={() => {
                      signIn(provider.id);
                    }}
                    className={isDarkMode ? "white_btn" : "black_btn"}
                  >
                    Masuk
                  </button>
                ))
              ) : (
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-500 h-10 w-10"></div>
                </div>
              )}
            </>
          )}
        </div>
      </nav>
    );
};

export default Nav;
