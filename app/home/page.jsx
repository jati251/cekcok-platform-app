import HighlightedLogos from "./logo";

export default function HomePage() {
  return (
    <section className="w-full flex-center flex-col mt-20 mb-20">
      <h1 className="head_text text-center">
        Temu & Bagikan
        <br className="max-md:hidden" />
        <span className="text-sky-300 text-center"> Wadah Untuk Bacot</span>
      </h1>
      <p className="desc text-center">
        CekCok adalah platform sosial dimana kita bisa adu bacot satu sama lain.
      </p>
      <div className="relative mt-4">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[70vw] h-[90vh] rounded-full opacity-70 bg-gradient-to-r from-gray-100 to-gray-400 blur-3xl shadow-xl"></div>
        </div>
        {/* Page Content */}
        <div className="relative z-10">
          <HighlightedLogos />
        </div>
      </div>
    </section>
  );
}
