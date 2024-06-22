import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL, {
  path: "/socket.io", // Make sure this matches the path on your server
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
