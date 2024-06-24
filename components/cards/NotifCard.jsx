"use client";

import { useDarkModeContext } from "@app/context/DarkModeProvider";
import { NotifLike } from "@components/notifType/NotifLike";

const NotifCard = ({ notif }) => {
  const { isDarkMode } = useDarkModeContext();

  return <NotifLike isDarkMode={isDarkMode} notif={notif} />;
};

export default NotifCard;
