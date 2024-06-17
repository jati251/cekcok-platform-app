import Feed from "@components/Feed";

export default function Home() {
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

      <Feed />
    </section>
  );
}
