export default function HomePage() {
  return (
    <section className="w-full flex-center flex-col mt-20 mb-20">
      <h1 className="head_text text-center">
        Temu & Bagikan
        <br className="max-md:hidden" />
        <span className="orange_gradient text-center"> Wadah Untuk Bacot</span>
      </h1>
      <p className="desc text-center">
        CekCok adalah platform sosial dimana kita bisa adu bacot satu sama lain.
      </p>
      <div className="flex items-center gap-8 justify-center mt-8 space-x-4 max-w-full flex-wrap">
        <img
          src={
            "https://seeklogo.com/images/T/tailwind-css-logo-89E99D7181-seeklogo.com.png"
          }
          alt="MongoDB Logo"
          style={{ width: 123, height: "auto" }}
        />
        <img
          src={
            "https://i.imgur.com/P6DEl7l.png"
          }
          alt="mongoose Logo"
          style={{ width: 140, height: "auto" }}
        />
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/2560px-MongoDB_Logo.svg.png"
          }
          alt="Next.js Logo"
          style={{ width: 140, height: "auto" }}
        />
        <img
          src={
            "https://static-00.iconduck.com/assets.00/nextjs-icon-2048x1234-pqycciiu.png"
          }
          alt="Tailwind CSS Logo"
          style={{ width: 100, height: "auto" }}
        />
        <img
          src={
            "https://seeklogo.com/images/G/google-developers-logo-F8BF3155AC-seeklogo.com.png"
          }
          alt="google logo"
          style={{ width: 100, height: "auto" }}
        />
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Vercel_logo_black.svg/2560px-Vercel_logo_black.svg.png"
          }
          alt="veercel logo"
          style={{ width: 130, height: "auto" }}
        />
        <img
          src={
            "https://logos-world.net/wp-content/uploads/2023/08/React-Symbol.png"
          }
          alt="react logo"
          style={{ width: 140, height: "auto" }}
        />
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/590px-Node.js_logo.svg.png"
          }
          alt="node logo"
          style={{ width: 120, height: "auto" }}
        />
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png"
          }
          alt="js logo"
          style={{ width: 60, height: "auto" }}
        />
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Giphy-logo.svg/1200px-Giphy-logo.svg.png"
          }
          alt="giphy logo"
          style={{ width: 140, height: "auto" }}
        />
        <img
          src={"https://www.svgrepo.com/show/352757/font-awesome-logo-full.svg"}
          alt="veercel logo"
          style={{ width: 140, height: "auto" }}
        />
      </div>
    </section>
  );
}
