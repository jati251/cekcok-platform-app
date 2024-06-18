import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import imageCompression from "browser-image-compression";

const ProfileBackground = ({ src, loading, onImageChange }) => {
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
        const croppedImage = await cropImageToRatio(compressedFile, 1500, 500);
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

  const cropImageToRatio = async (file, targetWidth, targetHeight) => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");

        // Determine the aspect ratio of the target dimensions
        const aspectRatio = targetWidth / targetHeight;

        // Calculate the dimensions for the cropped image
        let width = img.width;
        let height = img.height;

        if (width > height * aspectRatio) {
          width = height * aspectRatio;
        } else {
          height = width / aspectRatio;
        }

        // Center the crop within the image
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
      className={`absolute mt-10 top-12 left-0 right-0 w-full h-[22vh]`}
    >
      {!loading && (
        <>
          {!src ? (
            <div className=" h-[22vh] bg-gray-500"></div>
          ) : (
            <Image src={src} layout="fill" objectFit="cover" alt="Background" />
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
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ProfileBackground;
