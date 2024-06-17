"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import ImageUploader from "./ImageUploader";
import GifPicker from "gif-picker-react";

const CommentModal = ({
  isOpen,
  onClose,
  postId,
  isDetail,
  onCommentAdded,
  fetchComment,
}) => {
  const { data: session } = useSession();
  const [commentContent, setCommentContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showGifSelector, setShowGifSelector] = useState(false);

  const handleMediaRemove = () => {
    setSelectedMedia(null);
  };

  const handleImageUpload = (image) => {
    setSelectedMedia({ type: "image", src: image });
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) return alert("Komentar masih kosong");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          content: commentContent,
          author: session?.user.id,
          post: postId,
          media: selectedMedia,
        }),
      });

      if (response.ok) {
        onCommentAdded();
        setCommentContent("");
        if (isDetail) fetchComment();
        onClose();
      } else {
        console.error("Failed to add comment");
        setCommentContent("");
        handleMediaRemove();
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
            onClick={() => {
              handleMediaRemove();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>
        <textarea
          className="w-full mb-4 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          rows="4"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Tanggapan Anda..."
        ></textarea>
        <div className="flex items-center gap-4">
          <ImageUploader onChange={handleImageUpload} />
          <button
            type="button"
            onClick={() => setShowGifSelector(true)}
            className="px-5 py-1.5 bg-gray-200 rounded-full text-sm text-gray-700"
          >
            Select GIF
          </button>
        </div>

        {selectedMedia && (
          <div className="mt-4 flex flex-col items-start">
            {selectedMedia.type === "image" ? (
              <img
                src={selectedMedia.src}
                alt="Selected"
                className="max-w-full h-auto"
              />
            ) : (
              <img
                src={selectedMedia.src}
                alt="Selected GIF"
                className="max-w-full h-auto"
              />
            )}
            <button
              type="button"
              onClick={handleMediaRemove}
              className="p-2 text-red-500 mt-2 text-sm"
            >
              Hapus
            </button>
          </div>
        )}

        {showGifSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-4 rounded shadow-md w-full max-w-md gap-2">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                onClick={() => setShowGifSelector(false)}
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
              <div className="mt-6">
                <GifPicker
                  width={"100%"}
                  onGifClick={(val) => {
                    setSelectedMedia({ src: val.url, type: "gif" });
                    setShowGifSelector(false);
                  }}
                  tenorApiKey={"AIzaSyCJSfb7bLWqWOvHTpq3tXWs-syaV5W4RnE"}
                />
              </div>
            </div>
          </div>
        )}
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
