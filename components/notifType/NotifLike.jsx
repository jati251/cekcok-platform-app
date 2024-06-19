import TimeAgo from "@components/TimeAgo";
import {
  faFistRaised,
  faHeart,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useIsMobile } from "@utils/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const NotifLike = ({ isDarkMode, notif }) => {
  const router = useRouter();

  const handleClick = () => {
    switch (notif.type) {
      case "like":
        handleLike();
        break;
      case "hate":
        handleLike();
        break;
      case "follow":
        handleProfileClick();
        break;
      default:
        break;
    }
  };

  const handleLike = () => {
    router.push(`/comments/${notif.data.postId}`);
  };

  const handleProfileClick = () => {
    router.push(`/profile/${notif?.sender._id}?name=${notif?.sender.username}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer ${
        isDarkMode ? "hover:bg-[#080808]" : "hover:bg-[#dbdbdb]"
      } transition-colors duration-300 ${
        useIsMobile()
          ? `px-2 border-t ${
              isDarkMode ? "border-[#2f3336]" : "border-[#e3e3e3]"
            } py-4`
          : "prompt_card"
      }`}
    >
      <div className="flex justify-between items-start gap-5">
        <div className="flex-1 flex justify-start gap-4 cursor-pointer">
          <div
            className={`flex justify-start flex-col mt-4 w-[40px] ${
              notif?.type === "like"
                ? "text-rose-600"
                : notif?.type === "follow"
                ? ""
                : "text-orange-600"
            }`}
          >
            <FontAwesomeIcon
              icon={
                notif?.type === "like"
                  ? faHeart
                  : notif?.type === "follow"
                  ? faUserPlus
                  : faFistRaised
              }
              size="2x"
            />
          </div>

          <div className="flex flex-col w-full">
            <div className="flex justify-start flex-col my-2 w-[40px]">
              <Image
                src={notif?.sender?.image ?? "/assets/images/default-user.png"}
                alt="user_image"
                width={40}
                height={40}
                className="rounded-full object-contain"
              />
            </div>
            <div className="flex gap-1 items-center  ">
              <p
                className={`font-satoshi font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${
                  useIsMobile() ? "max-w-[150px]" : ""
                }`}
              >
                {notif?.sender?.fullName ?? "Anonim"}
              </p>
              <span
                className={`font-satoshi text-sm whitespace-nowrap overflow-hidden text-ellipsis `}
              >
                {notif?.type === "like"
                  ? "🤩 menyukai postingan anda"
                  : notif?.type === "follow"
                  ? "mengikuti anda"
                  : "🤬 benci postingan anda"}
              </span>
            </div>

            <p className="my-4 font-satoshi text-gray-500 break-all text-sm ">
              {notif?.data.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
