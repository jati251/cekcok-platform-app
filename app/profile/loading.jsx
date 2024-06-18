import Image from "next/image";

const Loading = ({ isDarkMode }) => {
  return (
    <div className="w-full flex-center">
      <Image
        src={
          isDarkMode
            ? "/assets/icons/loader-white.svg"
            : "/assets/icons/loader.svg"
        }
        width={50}
        height={50}
        alt="loader"
        className="object-contain"
      />
    </div>
  );
};

export default Loading;
