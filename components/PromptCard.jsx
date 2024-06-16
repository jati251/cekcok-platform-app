"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as solidThumbsUp,
  faThumbsDown as solidThumbsDown,
} from "@fortawesome/free-solid-svg-icons";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");
  const [likes, setLikes] = useState(Number(post.likes) || 0); // Assuming `post.likes` exists
  const [hates, setHates] = useState(Number(post.hates) || 0); // Assuming `post.likes` exists

  const [liked, setLiked] = useState(false); // Manage the liked state
  const [hated, setHated] = useState(false); // Manage the liked state

  const handleProfileClick = () => {
    if (post.creator._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleAction = async (action, value) => {
    if (!post._id) return alert("Missing PromptId!");

    try {
      const response = await fetch(`/api/prompt/${post._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
          likes: action === "like" ? String(value) : post.likes ?? "0",
          hates: action === "hate" ? String(value) : post.hates ?? "0",
          comments: post.comments ?? "0",
        }),
      });

      if (response.ok) {
        router.push("/");
      } else {
        throw new Error("Failed to update prompt");
      }
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const handleLike = () => {
    const newLikes = !liked ? likes + 1 : likes - 1;
    setLiked(!liked);
    setLikes(newLikes);
    handleAction("like", newLikes);
  };

  const handleHate = () => {
    const newHates = !hated ? hates + 1 : hates - 1;
    setHated(!hated);
    setHates(newHates);
    handleAction("hate", newHates);
  };

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">
        <div
          className="flex-1 flex justify-start items-center gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator.email}
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
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={handleLike}
        >
          <FontAwesomeIcon icon={solidThumbsUp} />
          <span>{likes}</span>
        </button>
        <button
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          onClick={handleHate}
        >
          <FontAwesomeIcon icon={hated ? solidThumbsDown : solidThumbsDown} />
          <span>{hates}</span>
        </button>
      </div>

      {session?.user.id === post.creator._id && pathName === "/profile" && (
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
  );
};

export default PromptCard;
