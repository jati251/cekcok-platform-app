import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Example breakpoint for mobile
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    // Update body class based on dark mode state
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Optionally, store the current mode in localStorage
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  return [isDarkMode, toggleDarkMode];
}

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useSocket = () => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      const socketInstance = io("http://www.cekcok.my.id", {
        path: "/api/socket.io",
        query: { userId: session.user.id },
      });

      setSocket(socketInstance);

      return () => socketInstance.disconnect();
    }
  }, [session]);

  return socket;
};
