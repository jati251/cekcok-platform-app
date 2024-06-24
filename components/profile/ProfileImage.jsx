import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import imageCompression from "browser-image-compression";
import { handleImageChange } from "@utils/helper";

const ProfileImage = ({ src, loading, onImageChange }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const cropImageToSquare = async (file) => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.min(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (img.width - maxSize) / 2,
          (img.height - maxSize) / 2,
          maxSize,
          maxSize,
          0,
          0,
          maxSize,
          maxSize
        );
        canvas.toBlob((blob) => {
          resolve(new File([blob], file.name, { type: file.type }));
        }, file.type);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    <div
      onClick={handleClick}
      className="relative group"
      style={{ width: "80px", height: "80px" }} // Ensure the div maintains the same size as the Image
    >
      {loading ? (
        <div className=" flex space-x-4">
          <div className="rounded-full bg-gray-500 h-[80px] w-[80px]"></div>
        </div>
      ) : (
        <>
          <Image
            src={src} // Provide a default image path
            width={80}
            height={80}
            className="rounded-full grayscale-[50%] "
            alt="profile"
          />
          {/* Container for icon */}
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
            <FontAwesomeIcon
              icon={faPen}
              className="text-white bg-black/50 p-2 rounded-full"
              size="md"
            />
          </div>
        </>
      )}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={(e) =>
          handleImageChange(e, cropImageToSquare, fileInputRef, onImageChange)
        }
      />
    </div>
  );
};

export default ProfileImage;
