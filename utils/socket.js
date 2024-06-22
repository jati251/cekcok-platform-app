import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  path: "/socket.io", // Make sure this matches the path on your server
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
