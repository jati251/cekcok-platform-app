import { useEffect, useState } from "react";

const BlurredImage = ({ src, alt, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return (
    <div style={{ ...style, position: "relative", overflow: "hidden" }}>
      <img
        loading="lazy"
        src={src}
        alt={alt}
        style={{
          ...style,
          filter: isLoaded ? "none" : "blur(20px)",
          transition: "filter 0.5s ease-in-out",
          position: "relative",
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};

export default BlurredImage;
