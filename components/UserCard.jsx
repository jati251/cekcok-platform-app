"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@utils/hooks";
import { useDarkModeContext } from "@app/context/DarkModeProvider";

const UserCard = ({ user, setSelected, selected }) => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const router = useRouter();

  const { isDarkMode } = useDarkModeContext();

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (pathname.includes("/chat")) {
      if (user?._id !== session?.user.id && session?.user)
        setSelected(user._id);
    } else {
      if (user?._id === session?.user.id && session?.user)
        return router.push("/profile");
      if (user?._id)
        router.push(`/profile/${user?._id}?name=${user?.username}`);
    }
  };

  return (
    <div
      onClick={handleProfileClick}
      className={`${
        selected === user?._id ? " bg-gray-700" : ""
      } cursor-pointer ${
        useIsMobile()
          ? `px-2 border-t ${
              isDarkMode ? "border-[#2f3336]" : "border-[#e3e3e3]"
            } py-4`
          : "prompt_card"
      }`}
    >
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start gap-2 cursor-pointer">
          <div className="flex justify-start flex-col mt-1 w-[40px]">
            <Image
              src={user?.image ?? "/assets/images/default-user.png"}
              alt="user_image"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />
          </div>

          <div className="flex flex-col w-full">
            <p
              className={`font-satoshi font-semibold  ${
                useIsMobile() ? "max-w-[150px]" : ""
              }`}
            >
              {user?.fullName ?? "Anonim"}
            </p>
            <span className={`font-satoshi text-gray-400 text-sm  `}>
              @{""}
              {user?.username ?? "Anonim"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
