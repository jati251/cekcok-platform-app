import React from "react";
import Image from "next/image";

const ZoomModal = ({ src, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 px-2"
      onClick={onClose}
    >
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        <Image
          src={src}
          width={500}
          height={500}
          className="rounded"
          alt="Zoomed Image"
        />
        <button
          className="absolute top-2 right-2 text-white text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ZoomModal;
