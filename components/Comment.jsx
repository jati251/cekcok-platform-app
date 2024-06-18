"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  faThumbsUp as solidThumbsUp,
  faThumbsDown as solidThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import TimeAgo from "./TimeAgo";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Comment = ({ comment, isDarkMode }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [likes, setLikes] = useState(comment?.likes ?? 0);
  const [hates, setHates] = useState(comment?.hates ?? 0);
  const [liked, setLiked] = useState(comment.liked ?? false);
  const [hated, setHated] = useState(comment.hated ?? false);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (comment?.author?._id === session?.user.id)
      return router.push("/profile");
    router.push(
      `/profile/${comment.author._id}?name=${comment.author.username}`
    );
  };

  const handleAction = async (action) => {
    if (!comment._id) return alert("Missing PromptId!");

    try {
      const response = await fetch(`/api/comments/hate-like/${comment._id}`, {
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

  const handleLike = (e) => {
    e.stopPropagation();
    const newLiked = !liked;
    if (newLiked) {
      setLiked(true);
      setHated(false);
      handleAction("like");
    } else {
      setLiked(false);
      handleAction("like");
    }
  };

  const handleHate = (e) => {
    e.stopPropagation();
    const newHated = !hated;
    if (newHated) {
      setHated(true);
      setLiked(false);
      handleAction("hate");
    } else {
      setHated(false);
      handleAction("hate");
    }
  };

  return (
    <div className="my-6 ">
      <div
        key={comment._id}
        className={`mb-4 pt-5 flex justify-start gap-6 border-t ${
          isDarkMode ? "border-[#2f3336]" : "border-[#e3e3e3]"
        } `}
      >
        <div className=" flex items-start mt-4">
          <Image
            onClick={handleProfileClick}
            src={comment.author.image ?? "/assets/images/default-user.png"}
            alt="comment_author"
            width={30}
            height={30}
            className="rounded-full cursor-pointer"
          />
        </div>
        <div className="w-60">
          <div className="mb-2">
            <div className="flex gap-2 items-center">
              <p className="font-satoshi text-md font-bold ">
                {comment.author.username}
              </p>
              <p className="font-satoshi text-sm ">{comment.author.email}</p>
            </div>
            {comment.createdAt && <TimeAgo timestamp={comment.createdAt} />}
          </div>
          <p className="font-inter break-all text-sm ">{comment.content}</p>
          {comment?.media?.src && (
            <div className="mt-4 flex flex-col items-start mb-4">
              {comment.media.type === "image" ? (
                <img
                  src={comment.media.src}
                  alt="Selected"
                  className="max-w-full h-auto"
                />
              ) : (
                <img
                  src={comment.media.src}
                  alt="GIF"
                  className="max-w-full h-auto"
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-start gap-6 items-center mt-3 px-4">
        <button
          disabled={!session?.user}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={handleLike}
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
          onClick={handleHate}
        >
          <FontAwesomeIcon
            color={hated ? "#f4977f" : "gray"}
            icon={hated ? solidThumbsDown : solidThumbsDown}
          />
          <span>{hates}</span>
        </button>
      </div>
    </div>
  );
};

export default Comment;
