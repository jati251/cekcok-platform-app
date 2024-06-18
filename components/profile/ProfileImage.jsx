import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import imageCompression from "browser-image-compression";

const ProfileImage = ({ src, loading, onImageChange }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file && !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      fileInputRef.current.value = null; // Clear the input value
      return;
    }

    if (file) {
      try {
        const options = {
          maxSizeMB: 0.2, // Maximum size of the compressed image (1MB in this example)
          maxWidthOrHeight: 800, // Maximum width or height of the compressed image
          useWebWorker: true, // Use web workers to offload compression process (optional)
        };

        const compressedFile = await imageCompression(file, options);
        const croppedImage = await cropImageToSquare(compressedFile);
        // Convert compressedFile to Base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          onImageChange(reader.result);
        };
        reader.readAsDataURL(croppedImage);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
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
          <div className="animate-pulse rounded-full bg-gray-500 h-[10vh] w-[10vh]"></div>
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
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ProfileImage;
