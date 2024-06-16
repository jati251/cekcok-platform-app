"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

const CommentModal = ({ isOpen, onClose, postId, onCommentAdded }) => {
  const { data: session } = useSession();
  const [commentContent, setCommentContent] = useState("");

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          content: commentContent,
          author: session?.user.id,
          post: postId,
        }),
      });

      if (response.ok) {
        onCommentAdded();
        setCommentContent("");
        onClose();
      } else {
        console.error("Failed to add comment");
        setCommentContent("");
        onClose();
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 p-2 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Berikan Komentar</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>
        <textarea
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          rows="4"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Tanggapan Anda..."
        ></textarea>
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAddComment}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Komentari
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
