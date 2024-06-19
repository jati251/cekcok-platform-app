"use client";

import { useRouter } from "next/navigation";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import { NotifLike } from "./notifType/NotifLike";
import { NotifFollow } from "./notifType/NotifFollow";
import { NotifMention } from "./notifType/NotifMention";

const NotifCard = ({ notif }) => {
  const router = useRouter();
  const { isDarkMode } = useDarkModeContext();

  const handleDetail = () => {
    router.push(`/comments/${notif._id}`);
  };

  switch (notif.type) {
    case "like":
      return <NotifLike isDarkMode={isDarkMode} notif={notif} />;
    case "hate":
      return <NotifLike isDarkMode={isDarkMode} notif={notif} />;
    case "follow":
      return (
        <NotifFollow
          isDarkMode={isDarkMode}
          notif={notif}
          submit={handleDetail}
        />
      );
    case "comment":
      return (
        <NotifMention
          isDarkMode={isDarkMode}
          notif={notif}
          submit={handleDetail}
        />
      );
    case "mention":
      return (
        <NotifMention
          isDarkMode={isDarkMode}
          notif={notif}
          submit={handleDetail}
        />
      );
    default:
      break;
  }
};

export default NotifCard;
