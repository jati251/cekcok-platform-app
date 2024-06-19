"use client";

import { useDarkModeContext } from "@app/context/DarkModeProvider";
import { NotifLike } from "./notifType/NotifLike";

const NotifCard = ({ notif }) => {
  const { isDarkMode } = useDarkModeContext();

  return <NotifLike isDarkMode={isDarkMode} notif={notif} />;
};

export default NotifCard;
