// pages/chat/[id].js

"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import socket from "@utils/socket";
import { useSession } from "next-auth/react";
import { faPaperPlane, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loading from "@app/profile/loading";
import { useDarkModeContext } from "@app/context/DarkModeProvider";

const ChatPage = ({ params }) => {
  const recipientId = params.id;
  const router = useRouter();
  const [recipient, setRecipient] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [totalPage, setTotalPage] = useState(1);
  // const [hasMore, setHasMore] = useState(true);
  const { data: session, status } = useSession();
  const { isDarkMode } = useDarkModeContext();

  const messagesEndRef = useRef(null);

  const roomId =
    session?.user?.id && recipientId
      ? [session.user.id, recipientId].sort().join("-")
      : null;

  const fetchMessages = async (val) => {
    setLoading(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          userId: session.user.id,
          recipientId,
        }),
      });

      const data = await response.json();

      if (data.length > 0) {
        if (messages.length === 0) setMessages(data);
        else setMessages((prevPosts) => [...prevPosts, ...data]);
        // setHasMore(data.length > 0);
      }
      // else {
      //    setHasMore(false);
      // }

      // setTotalPage(data.totalPages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const sendMessage = () => {
    if (message.trim() && recipientId) {
      socket.emit("privateMessage", {
        recipientId,
        message,
        roomId,
        senderId: session?.user.id,
      });
      setMessage("");
    }
  };

  const fetchRecipient = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/get`, {
        method: "POST",
        body: JSON.stringify({
          userId: recipientId,
        }),
      });
      const data = await response.json();
      setRecipient(data);
    } catch (error) {
      console.error("Error fetching recipient:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetchRecipient();
  }, [recipientId]);

  useEffect(() => {
    if (roomId) {
      socket.emit("join", roomId);

      socket.on("receivePrivateMessage", (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      fetchMessages();

      return () => {
        socket.off("receivePrivateMessage");
        socket.off("messageSent");
      };
    }
  }, [roomId, recipientId]);

  return (
    <div className="flex flex-col h-screen w-full">
      {recipientId && (
        <div className="flex flex-col h-screen">
          <header className="flex items-center p-4 ">
            <button onClick={handleBack} className="mr-4 ">
              <FontAwesomeIcon icon={faArrowLeft} size="lg" />
            </button>
            {recipient ? (
              <div className="flex items-center">
                <img
                  src={recipient.image}
                  alt={recipient.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <span className="text-lg font-semibold">
                  {recipient.fullName || recipient.username}
                </span>
              </div>
            ) : (
              <span className="text-lg font-semibold">Loading...</span>
            )}
          </header>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 ">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.senderId === session.user.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-6 py-3  shadow-lg text-lg ${
                    msg.senderId === session.user.id
                      ? "bg-blue-500 text-white rounded-tr-full rounded-l-full  "
                      : "bg-gray-300 rounded-r-full rounded-tl-full"
                  } ${
                    isDarkMode && msg.senderId !== session.user.id
                      ? "dark:bg-gray-700 dark:text-gray-100 "
                      : ""
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            {loading && <Loading isDarkMode={isDarkMode} />}
            <div ref={messagesEndRef}></div>
          </div>
          <div
            className={`flex items-center p-4 bg-white ${
              isDarkMode ? "dark:bg-gray-900 border-t dark:border-gray-700" : ""
            }`}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik sesuatu..."
              className={`flex-1 px-4 py-2 rounded-l-md border border-gray-300 ${
                isDarkMode
                  ? "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  : ""
              } focus:outline-none`}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
