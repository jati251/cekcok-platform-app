import { useEffect, useState } from "react";

const BlurredImage = ({ src, alt, style, isProfile }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  let screen = { width: "100%", height: "auto" };
  if (isProfile)
    screen = {
      width: "40px",
      height: "40px",
      borderRadius: "9999px",
      objectFit: "contain",
    };

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
          ...screen,
        }}
      />
    </div>
  );
};

export default BlurredImage;
