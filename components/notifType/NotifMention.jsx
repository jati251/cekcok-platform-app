import TimeAgo from "@components/TimeAgo";
import { useIsMobile } from "@utils/hooks";
import Image from "next/image";

export const NotifMention = ({ isDarkMode, notif, submit }) => {
  return (
    <div
      onClick={submit}
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
        <div className="flex-1 flex justify-start gap-2 cursor-pointer">
          <div className="flex justify-start flex-col mt-1 w-[40px]">
            <Image
              src={notif?.sender?.image ?? "/assets/images/default-user.png"}
              alt="user_image"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />
          </div>

          <div onClick={submit} className="flex flex-col w-full">
            <div className="flex gap-1 items-center justify-between ">
              <p
                className={`font-satoshi font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${
                  useIsMobile() ? "max-w-[150px]" : ""
                }`}
              >
                {notif?.sender?.fullName ?? "Anonim"}
              </p>
              <span
                className={`font-satoshi text-gray-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis `}
              >
                @{""}
                {notif?.sender?.username ?? notif?.author?.username ?? "Anonim"}
              </span>
            </div>
            {notif.createdAt && <TimeAgo timestamp={notif.createdAt} />}

            <p className="my-4 font-satoshi break-all text-sm ">
              {notif?.data.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
