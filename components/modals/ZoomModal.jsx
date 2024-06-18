import React from "react";
import Image from "next/image";

const ZoomModal = ({ src, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-2"
      onClick={onClose}
    >
      <div
        className="relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on the image itself
      >
        <Image
          src={src}
          width={500} // Adjust as needed
          height={500} // Adjust as needed
          className="rounded"
          alt="Zoomed Image"
        />
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={onClose}
        >
          &times; {/* Close button */}
        </button>
      </div>
    </div>
  );
};

export default ZoomModal;
