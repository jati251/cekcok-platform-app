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
  handleTagClick,
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
    if (
      (post?.creator?._id || post?.author?._id) === session?.user.id &&
      session?.user
    )
      return router.push("/profile");
    if (post?.creator?._id)
      router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
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

  const handleAction = async (action, value) => {
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

      const updatedPost = await response.json();
      setLikes(updatedPost.likes);
      setHates(updatedPost.hates);
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const handleInteract = (e, action) => {
    e.stopPropagation();
    if (action === "hate") {
      const newHated = !hated;
      const newHates = newHated ? hates + 1 : hates - 1;
      if (newHated) {
        setHated(true);
        setLiked(false);
        handleAction(action, newHates);
        if (likes > 0) setLikes((val) => val - 1);
        setHates(newHates);
      } else {
        setHated(false);
        handleAction(action, newHates);
        setHates(newHates);
      }
    } else {
      const newLiked = !liked;
      const newLikes = newLiked ? likes + 1 : likes - 1;
      if (newLiked) {
        setLiked(true);
        setHated(false);
        handleAction(action, newLikes);
        setLikes(newLikes);
        if (hates > 0) setHates((val) => val - 1);
      } else {
        setLiked(false);
        handleAction(action, newLikes);
        setLikes(newLikes);
      }
    }
  };

  return (
    <>
      <div
        onClick={handleDetail}
        className={`cursor-pointer ${
          isDarkMode ? "hover:bg-[#080808]" : "hover:bg-[#dbdbdb]"
        } transition-colors duration-300 ${
          useIsMobile()
            ? `px-4 border-t ${
                isDarkMode ? "border-[#2f3336]" : "border-[#e3e3e3]"
              } py-4`
            : "prompt_card"
        }`}
      >
        <div className="flex justify-between items-start gap-5">
          <div className="flex-1 flex justify-start items-center gap-3 cursor-pointer">
            <Image
              onClick={handleProfileClick}
              src={
                post?.creator?.image ??
                post?.author?.image ??
                "/assets/images/default-user.png"
              }
              alt="user_image"
              width={40}
              height={40}
              className="rounded-full object-contain"
            />

            <div className="flex flex-col">
              <h3 className="font-satoshi font-semibold">
                {post?.creator?.username ?? post?.author?.username ?? "Anonim"}
              </h3>
              {post.createdAt && <TimeAgo timestamp={post.createdAt} />}
            </div>
          </div>

          <div className="copy_btn" onClick={handleCopy}>
            <Image
              loading="lazy"
              src={
                copied === post.prompt
                  ? "/assets/icons/tick.svg"
                  : "/assets/icons/copy.svg"
              }
              alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
              width={20}
              height={20}
            />
          </div>
        </div>

        <p className="my-4 font-satoshi break-all text-sm ">{post.prompt}</p>

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

        <p
          className="font-inter text-sm blue_gradient cursor-pointer"
          onClick={() => handleTagClick && handleTagClick(post.tag)}
        >
          #{post.tag}
        </p>
        <div className="flex justify-start gap-6 items-center mt-3">
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
