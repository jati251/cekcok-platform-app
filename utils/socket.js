import { io } from "socket.io-client";

const socket = io("http://www.cekcok.my.id", {
  path: "/api/socket.io",
});

export default socket;
