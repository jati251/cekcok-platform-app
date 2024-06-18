"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { usePathname } from "next/navigation";

const Nav = () => {
  const pathname = usePathname();
  const hideNavAndFooter = ["/login", "/register", "/profile-setup",'/profile'].includes(
    pathname
  );

  const { data: session, status } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true); // State to track navbar visibility

  // Function to handle scroll event
  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos < 20; // Adjust as needed based on your design
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

  if (hideNavAndFooter) return;
  if (status !== "loading")
    return (
      <nav
        className={`fixed top-0 left-0 right-0 p-4 z-50 flex-between w-full mb-16 pt-1 bg-gradient-to-b from-gray-500 transition-all  ${
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
                <div className="dropdown shadow-xl">
                  <Link
                    href="/profile"
                    className="dropdown_link"
                    onClick={() => setToggleDropdown(false)}
                  >
                    Cek Profil Saya
                  </Link>
                  <Link
                    href="/create-prompt"
                    className="dropdown_link"
                    onClick={() => setToggleDropdown(false)}
                  >
                    Buat Bacotan Baru
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setToggleDropdown(false);
                      signOut();
                    }}
                    className="mt-5 w-full black_btn"
                  >
                    Keluar
                  </button>
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
                    className="black_btn"
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
