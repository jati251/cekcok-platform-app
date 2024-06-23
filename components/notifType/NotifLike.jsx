import BlurredProfile from "@components/input/BlurredProfile";
import {
  faComment,
  faFistRaised,
  faHeart,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useIsMobile } from "@utils/hooks";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const BaseNotif = ({ notif }) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-start flex-col my-2 w-[40px]">
        <BlurredProfile
          src={notif?.sender?.image ?? "/assets/images/default-user.png"}
          alt="user_image"
          style={{ width: "40px", height: "40px" }}
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
        <span className={`font-satoshi text-sm `}>
          {notif?.type === "like"
            ? "🤩 menyukai postingan anda"
            : notif?.type === "follow"
            ? "mengikuti anda"
            : notif?.type === "comment"
            ? "🧐 mengomentari anda"
            : "🤬 benci postingan anda"}
        </span>
      </div>

      <p
        className={`my-4 font-satoshi ${
          notif?.read ? "text-gray-500" : ""
        } break-all text-sm `}
      >
        {notif?.data?.message}
      </p>
    </div>
  );
};

const MessageNotif = ({ notif, userId }) => {
  const { data: session } = useSession();
  return (
    <div className="flex w-full gap-4">
      <div className="flex justify-start items-center flex-col my-2 w-[40px]">
        <BlurredProfile
          src={
            userId === notif.sender._id
              ? notif?.recipient?.image
              : notif?.sender?.image ?? "/assets/images/default-user.png"
          }
          alt="user_image"
          style={{ width: "40px", height: "40px" }}
        />
      </div>
      <div className="flex flex-col gap-1 justify-start ">
        <p
          className={`font-satoshi font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${
            useIsMobile() ? "max-w-[150px]" : ""
          }`}
        >
          {userId === notif.sender._id
            ? notif?.recipient?.fullName
            : notif?.sender?.fullName ?? "Anonim"}
        </p>
        <p
          className={`font-satoshi ${
            !notif?.read && notif?.recipient?._id === session?.user?.id
              ? ""
              : "text-gray-500"
          } break-all text-sm `}
        >
          {!notif?.read && notif?.sender?._id === session?.user?.id && "you: "}
          {notif?.data?.message}
        </p>
      </div>
    </div>
  );
};

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
      case "message":
        handleMessage();
        break;
      case "follow":
        handleProfileClick();
        break;
      default:
        break;
    }
  };

  const { data: session } = useSession();

  const handleLike = () => {
    router.push(`/comments/${notif.data.postId}`);
  };

  const handleProfileClick = () => {
    router.push(`/profile/${notif?.sender._id}?name=${notif?.sender.username}`);
  };

  const handleMessage = () => {
    const id =
      session?.user?.id !== notif?.sender._id
        ? notif?.sender._id
        : notif?.recipient._id;
    router.push(`/chat/${id}`);
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
        <div
          className={`${
            notif.type === "message" ? "mx-3" : ""
          } flex-1 flex justify-start gap-4 cursor-pointer`}
        >
          {notif.type !== "message" && (
            <div
              className={`flex justify-start flex-col mt-4 w-[40px] ${
                notif?.type === "like"
                  ? "text-rose-600"
                  : notif?.type === "follow"
                  ? ""
                  : notif?.type === "comment"
                  ? "text-blue-500"
                  : "text-orange-600"
              }`}
            >
              <FontAwesomeIcon
                icon={
                  notif?.type === "like"
                    ? faHeart
                    : notif?.type === "follow"
                    ? faUserPlus
                    : notif?.type === "comment"
                    ? faComment
                    : faFistRaised
                }
                size="2x"
              />
            </div>
          )}

          {notif.type !== "message" ? (
            <BaseNotif notif={notif} />
          ) : (
            <MessageNotif userId={session.user.id} notif={notif} />
          )}
        </div>
      </div>
    </div>
  );
};
