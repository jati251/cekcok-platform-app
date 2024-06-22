"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as solidThumbsUp,
  faThumbsDown as solidThumbsDown,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import CommentModal from "./modals/CommentModal";
import TimeAgo from "./TimeAgo";
import { useIsMobile } from "@utils/hooks";
import { useDarkModeContext } from "@app/context/DarkModeProvider";

const PromptCard = ({
  post,
  isDetail,
  handleEdit,
  handleDelete,
  fetchComment,
}) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState("");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [hates, setHates] = useState(post?.hates || 0);
  const [totalComments, setTotalComments] = useState(
    Number(post?.comments?.length) || 0
  );
  const [liked, setLiked] = useState(post.liked || false);
  const [hated, setHated] = useState(post.hated || false);
  const { isDarkMode } = useDarkModeContext();

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (post?.creator?._id === session?.user.id && session?.user)
      return router.push("/profile");
    if (post?.creator?._id)
      router.push(
        `/profile/${post?.creator?._id}?name=${post?.creator?.username}`
      );
  };

  const handleDetail = () => {
    router.push(`/comments/${post._id}`);
  };

  const handleCopy = (e) => {
    e.stopPropagation();

    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleAction = async (action, flag) => {
    if (!post._id) return alert("Missing PromptId!");

    try {
      const response = await fetch(`/api/prompt/hate-like/${post._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          userId: session.user.id,
          action,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update likes and hates");
      }
      if (post.creator._id !== session?.user.id && flag)
        handleNotif(post.creator._id, session.user.id, action, {
          postId: post._id,
          message: post.prompt,
        });

      const updatedPost = await response.json();
      setLikes(updatedPost.likes);
      setHates(updatedPost.hates);
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const handleInteract = (e, action) => {
    e.stopPropagation();
    const newHated = action === "hate" ? !hated : false;
    const newLiked = action === "like" ? !liked : false;
    const updatedLikes = newLiked ? likes + 1 : liked ? likes - 1 : likes;
    const updatedHates = newHated ? hates + 1 : hated ? hates - 1 : hates;
    setHated(newHated);
    setLiked(newLiked);

    if (newHated || newLiked) {
      handleAction(action, true);
    } else {
      handleAction(action);
    }
    setHates(updatedHates);
    setLikes(updatedLikes);
  };

  const handleNotif = async (recipientId, senderId, type, data) => {
    await fetch(`/api/notif`, {
      method: "POST",
      body: JSON.stringify({
        recipientId,
        senderId,
        type,
        data,
      }),
    });
  };
  return (
    <>
      <div
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
            <div
              onClick={(e) => {
                post?.creator?.status !== "private" && handleProfileClick(e);
              }}
              className="flex justify-start flex-col mt-1 w-[40px]"
            >
              <Image
                src={post?.creator?.image ?? "/assets/images/default-user.png"}
                alt="user_image"
                width={40}
                height={40}
                className="rounded-full object-contain"
              />
            </div>

            <div onClick={handleDetail} className="flex flex-col w-full">
              <div
                onClick={(e) => {
                  post?.creator?.status !== "private" && handleProfileClick(e);
                }}
                className="flex gap-1 items-center justify-between "
              >
                <p
                  className={`font-satoshi font-semibold whitespace-nowrap overflow-hidden text-ellipsis ${
                    useIsMobile() ? "max-w-[150px]" : ""
                  }`}
                >
                  {post?.creator?.fullName ?? "Anonim"}
                </p>
                <span
                  className={`font-satoshi text-gray-400 text-sm whitespace-nowrap overflow-hidden text-ellipsis `}
                >
                  @{""}
                  {post?.creator?.username ??
                    post?.author?.username ??
                    "Anonim"}
                </span>

                <div className="copy_btn " onClick={handleCopy}>
                  <Image
                    loading="lazy"
                    src={
                      copied === post.prompt
                        ? "/assets/icons/tick.svg"
                        : "/assets/icons/copy.svg"
                    }
                    alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
                    width={15}
                    height={15}
                  />
                </div>
              </div>
              {post.createdAt && <TimeAgo timestamp={post.createdAt} />}

              <p className="my-4 font-satoshi break-words text-sm ">
                {post.prompt}
              </p>

              {post?.media?.src && (
                <div className="mt-4 flex flex-col items-start mb-4">
                  {post.media.type === "image" ? (
                    <img
                      src={post.media.src}
                      alt="Selected"
                      className="max-w-full h-auto"
                    />
                  ) : (
                    <img
                      src={post.media.src}
                      alt="GIF"
                      className="max-w-full h-auto"
                    />
                  )}
                </div>
              )}
              <p className="font-inter text-sm blue_gradient cursor-pointer">
                #{post.tag}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-start gap-6 items-center mt-3 ml-5">
          <button
            disabled={!session?.user}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={(e) => handleInteract(e, "like")}
          >
            <FontAwesomeIcon
              color={liked ? "#2499e7" : "gray"}
              icon={solidThumbsUp}
            />
            <span>{likes}</span>
          </button>
          <button
            disabled={!session?.user}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={(e) => handleInteract(e, "hate")}
          >
            <FontAwesomeIcon
              color={hated ? "#f4977f" : "gray"}
              icon={hated ? solidThumbsDown : solidThumbsDown}
            />
            <span>{hates}</span>
          </button>
          <button
            disabled={!session?.user}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setIsCommentModalOpen(true);
            }}
          >
            <FontAwesomeIcon color="gray" icon={faComment} />
            <span>{totalComments}</span>
          </button>
        </div>

        {session?.user.id === post?.creator?._id && pathName === "/profile" && (
          <div
            className={`mt-5 flex justify-around text-md gap-4 border-t ${
              isDarkMode ? "border-[#2f3336]" : "border-[#e3e3e3]"
            } pt-3`}
          >
            <p
              className="font-inter font-semibold green_gradient cursor-pointer"
              onClick={handleEdit}
            >
              Ubah
            </p>
            <p
              className="font-inter font-semibold orange_gradient cursor-pointer"
              onClick={handleDelete}
            >
              Hapus
            </p>
          </div>
        )}
      </div>
      <CommentModal
        handleNotif={(comment) => {
          if (post.creator._id !== session?.user.id)
            handleNotif(post.creator._id, session.user.id, "comment", {
              postId: post._id,
              message: comment,
            });
        }}
        isDetail={isDetail}
        fetchComment={fetchComment}
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        postId={post._id}
        onCommentAdded={() => {
          setTotalComments(totalComments + 1);
        }}
      />
    </>
  );
};

export default PromptCard;
