import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import imageCompression from "browser-image-compression";
import { handleImageChange } from "@utils/helper";

const ProfileBackground = ({ src, loading, onImageChange }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const cropImageToRatio = async (file, targetWidth, targetHeight) => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");

        const aspectRatio = targetWidth / targetHeight;

        let width = img.width;
        let height = img.height;

        if (width > height * aspectRatio) {
          width = height * aspectRatio;
        } else {
          height = width / aspectRatio;
        }

        const x = (img.width - width) / 2;
        const y = (img.height - height) / 2;

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          x,
          y,
          width,
          height,
          0,
          0,
          targetWidth,
          targetHeight
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
      className={`absolute mt-[3vh] top-12 left-0 right-0 w-full h-[22vh]`}
    >
      {loading ? (
        <div className=" animate-pulse  h-[22vh] bg-gray-500"></div>
      ) : (
        <>
          {!src ? (
            <div className=" h-[22vh] bg-gray-500"></div>
          ) : (
            <Image
              src={src}
              fill
              style={{ objectFit: "cover" }}
              alt="Background"
            />
          )}

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
          handleImageChange(e, cropImageToRatio, fileInputRef, onImageChange)
        }
      />
    </div>
  );
};

export default ProfileBackground;
