import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GifPicker from "gif-picker-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import { useSession } from "next-auth/react";
import CustomInput from "./input/CustomInput";
import { useDarkModeContext } from "@app/context/DarkModeProvider";
import CustomTextArea from "./input/CustomTextArea";
import { useRouter } from "next/navigation";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showGifSelector, setShowGifSelector] = useState(false);
  const { status } = useSession();
  const { isDarkMode } = useDarkModeContext();
  const router = useRouter();

  const handleMediaRemove = () => {
    setSelectedMedia(null);
  };

  const enhancedHandleSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e, selectedMedia);
  };

  const handleImageUpload = (image) => {
    setSelectedMedia({ type: "image", src: image });
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status]);

  return (
    <section className="w-full px-4 max-w-full flex-start flex-col mt-20 mb-20">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Bacot</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} dan bagikan bacotanmu dengan dunia.
      </p>

      <form
        onSubmit={enhancedHandleSubmit}
        className="mt-4 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <div>
          <CustomTextArea
            isDarkMode={isDarkMode}
            maxLength={280}
            label="Tuliskan bacotanmu disini"
            value={post.prompt}
            onChange={(e) => {
              if (post.prompt.length < 280)
                setPost({ ...post, prompt: e.target.value });
            }}
          />
        </div>

        <span className="font-satoshi font-semibold text-base text-gray-700">
          Hastag{" "}
          <span className="font-normal mb-4">
            (#product, #webdevelopment, #idea, etc.)
          </span>
        </span>
        <CustomInput
          value={post.tag}
          label={"Hashtag"}
          isDarkMode={isDarkMode}
          onChange={(e) => setPost({ ...post, tag: e.target.value })}
        />

        <div className="flex items-center gap-4">
          <ImageUploader onChange={handleImageUpload} />
          <button
            type="button"
            onClick={() => setShowGifSelector(true)}
            className=" px-5 py-1.5 bg-gray-100 rounded-full font-semibold font-satoshi text-sm text-gray-700"
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

        <div className="flex-end mx-3 mb-5 gap-8">
          <div
            onClick={() => router.back()}
            className="cursor-pointer text-gray-400 text-lg"
          >
            Batal
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`px-5 py-1.5 text-lg rounded-full ${
              !isDarkMode ? "black_btn" : "white_btn"
            }`}
          >
            <p>{submitting ? `${type}in...` : type}</p>
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
