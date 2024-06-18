"use client";

import { DarkModeProvider } from "@app/context/DarkModeProvider";
import { SessionProvider } from "next-auth/react";

const Provider = ({ children, session }) => (
  <DarkModeProvider>
    <SessionProvider session={session}>{children}</SessionProvider>
  </DarkModeProvider>
);

export default Provider;
