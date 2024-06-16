import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
    faThumbsUp as solidThumbsUp,
    faThumbsDown as solidThumbsDown,
  } from "@fortawesome/free-solid-svg-icons";

const { default: Image } = require("next/image");

const Comment = ({ comment }) => {
  const { data: session } = useSession();

  const [likes, setLikes] = useState(comment?.likes || 0);
  const [hates, setHates] = useState(comment?.hates || 0);

  const [liked, setLiked] = useState(comment.liked || false);
  const [hated, setHated] = useState(comment.hated || false);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (comment?.author?._id === session?.user.id)
      return router.push("/profile");
    router.push(
      `/profile/${comment.author._id}?name=${comment.author.username}`
    );
  };

  const handleAction = async (action, value) => {
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
    const newLikes = newLiked ? likes + 1 : likes - 1;
    if (newLiked) {
      setLiked(true);
      setHated(false);
      handleAction("like", newLikes);
    } else {
      setLiked(false);
      handleAction("like", newLikes);
    }
  };

  const handleHate = (e) => {
    e.stopPropagation();

    const newHated = !hated;
    const newHates = newHated ? hates + 1 : hates - 1;
    if (newHated) {
      setHated(true);
      setLiked(false);
      handleAction("hate", newHates);
    } else {
      setHated(false);
      handleAction("hate", newHates);
    }
  };
  return (
    <>
      <div
        key={comment._id}
        className="my-4 flex justify-start gap-6 border-t-2 border-t-gray-300 pt-2"
      >
        <div className=" flex items-center">
          <Image
            onClick={handleProfileClick}
            src={comment.author.image ?? "/assets/images/default-user.png"}
            alt="comment_author"
            width={30}
            height={30}
            className="rounded-full"
          />
        </div>
        <div className="gap-2 w-60">
          <div className="flex gap-2 items-center">
            <p className="font-satoshi text-md font-bold text-gray-700">
              {comment.author.username}
            </p>
            <p className="font-satoshi text-sm text-gray-700">
              {comment.author.email}
            </p>
          </div>

          <p className="font-inter break-all text-sm text-gray-600">{comment.content}</p>
        </div>
      </div>
      <div className="flex justify-start gap-6 items-center mt-3">
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
    </>
  );
};

export default Comment;
