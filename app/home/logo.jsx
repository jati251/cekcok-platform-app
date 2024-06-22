const logoData = [
  {
    src: "https://cdn.icon-icons.com/icons2/2699/PNG/512/socketio_logo_icon_168806.png",
    alt: "Socket Io",
    width: 140,
  },

  {
    src: "https://i.imgur.com/P6DEl7l.png",
    alt: "Mongoose Logo",
    width: 140,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/2560px-MongoDB_Logo.svg.png",
    alt: "MongoDB Logo",
    width: 140,
  },
  {
    src: "https://i.imgur.com/fjpVYsE.png",
    alt: "swr",
    width: 140,
  },
  {
    src: "https://static-00.iconduck.com/assets.00/nextjs-icon-2048x1234-pqycciiu.png",
    alt: "Next.js Logo",
    width: 100,
  },
  {
    src: "https://seeklogo.com/images/G/google-developers-logo-F8BF3155AC-seeklogo.com.png",
    alt: "Google Logo",
    width: 100,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vercel_logo_black.svg/2560px-Vercel_logo_black.svg.png",
    alt: "Vercel Logo",
    width: 130,
  },
  {
    src: "https://logos-world.net/wp-content/uploads/2023/08/React-Symbol.png",
    alt: "React Logo",
    width: 140,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/590px-Node.js_logo.svg.png",
    alt: "Node.js Logo",
    width: 120,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png",
    alt: "JavaScript Logo",
    width: 60,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Giphy-logo.svg/1200px-Giphy-logo.svg.png",
    alt: "Giphy Logo",
    width: 140,
  },
  {
    src: "https://seeklogo.com/images/T/tailwind-css-logo-89E99D7181-seeklogo.com.png",
    alt: "Tailwind CSS Logo",
    width: 123,
  },
  {
    src: "https://www.svgrepo.com/show/352757/font-awesome-logo-full.svg",
    alt: "Font Awesome Logo",
    width: 140,
  },
];

const HighlightedLogos = () => (
  <div className="flex items-center gap-8 justify-center mt-8 space-x-4 max-w-full flex-wrap">
    {logoData.map((logo, index) => (
      <img
        key={index}
        src={logo.src}
        alt={logo.alt}
        style={{ width: logo.width, height: "auto" }}
      />
    ))}
  </div>
);

export default HighlightedLogos;
