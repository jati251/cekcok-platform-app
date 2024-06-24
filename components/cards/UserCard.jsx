"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useIsMobile } from "@utils/hooks";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import BlurredImage from "@components/input/BlurredImage";

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

  const bg =
    selected === user?._id && isDarkMode
      ? " bg-gray-800"
      : selected === user?._id && !isDarkMode
      ? " bg-gray-200"
      : "";

  return (
    <div
      onClick={handleProfileClick}
      className={`${bg} cursor-pointer transition-colors duration-300 ${
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
            <BlurredImage
              isProfile
              src={user?.image ?? "/assets/images/default-user.png"}
              alt="user_image"
              style={{ width: "40px", height: "40px" }}
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
