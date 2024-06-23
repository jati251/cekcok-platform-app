"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import ImageUploader from "../ImageUploader";
import GifPicker from "gif-picker-react";
import CustomTextArea from "@components/input/CustomTextArea";
import { useDarkModeContext } from "@app/context/DarkModeProvider";

const CommentModal = ({
  isOpen,
  onClose,
  postId,
  isDetail,
  onCommentAdded,
  fetchComment,
  handleNotif,
}) => {
  const { data: session } = useSession();
  const [commentContent, setCommentContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showGifSelector, setShowGifSelector] = useState(false);
  const { isDarkMode } = useDarkModeContext();

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
        handleNotif(commentContent);
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

  const handleClose = (e) => {
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 p-2 flex items-center justify-center ${
        isDarkMode ? "bg-gray-900" : "bg-black"
      } bg-opacity-50`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          !isDarkMode ? "bg-white" : "bg-black"
        } p-6 rounded-lg shadow-lg w-full max-w-md`}
      >
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
        <CustomTextArea
          isDarkMode={isDarkMode}
          maxLength={280}
          onChange={(e) =>
            commentContent.length <= 280 && setCommentContent(e.target.value)
          }
          value={commentContent}
          label={"Tanggapan anda"}
        />

        <div className="flex items-center gap-4">
          <ImageUploader onChange={handleImageUpload} />
          <button
            type="button"
            onClick={() => setShowGifSelector(true)}
            className="px-5 font-satoshi font-semibold py-1.5 bg-gray-100 rounded-full text-sm text-gray-700"
          >
            GIF
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
            <div className="relative bg-gray-100 p-4 rounded shadow-md w-full max-w-md gap-2">
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
            className={`${
              isDarkMode ? "white_btn" : "black_btn"
            }  px-4 py-2 rounded-md hover:bg-gray-500 transition-colors`}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
