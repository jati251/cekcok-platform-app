"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as solidThumbsUp,
  faThumbsDown as solidThumbsDown,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import CommentModal from "./CommentModal";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  // console.log(post);
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

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (post?.creator?._id ?? post?.author?._id === session?.user.id)
      return router.push("/profile");
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
      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        postId={post._id}
        onCommentAdded={() => {
          setTotalComments(totalComments + 1);
        }}
      />
      <div onClick={handleDetail} className="cursor-pointer prompt_card">
        <div className="flex justify-between items-start gap-5">
          <div
            onClick={handleProfileClick}
            className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          >
            <Image
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
              <h3 className="font-satoshi font-semibold text-gray-900">
                {post?.creator?.username ?? post?.author?.username}
              </h3>
              <p className="font-inter text-sm text-gray-500">
                {post?.creator?.email ?? post?.author?.email}
              </p>
            </div>
          </div>

          <div className="copy_btn" onClick={handleCopy}>
            <Image
              src={
                copied === post.prompt
                  ? "/assets/icons/tick.svg"
                  : "/assets/icons/copy.svg"
              }
              alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
              width={12}
              height={12}
            />
          </div>
        </div>

        <p className="my-4 font-satoshi text-sm text-gray-700">{post.prompt}</p>
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
          <button
            disabled={!session?.user}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
            onClick={() => setIsCommentModalOpen(true)}
          >
            <FontAwesomeIcon color="gray" icon={faComment} />
            <span>{totalComments}</span>
          </button>
        </div>

        {session?.user.id === post?.creator?._id && pathName === "/profile" && (
          <div className="mt-5 flex-center gap-4 border-t border-gray-100 pt-3">
            <p
              className="font-inter text-sm green_gradient cursor-pointer"
              onClick={handleEdit}
            >
              Edit
            </p>
            <p
              className="font-inter text-sm orange_gradient cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default PromptCard;
