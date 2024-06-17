import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PromptCard from "./PromptCard";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const Profile = ({ name, desc, data, handleEdit, handleDelete }) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <section className="w-full mt-20">
      <button
        className="my-6 flex font-satoshi items-center gap-4 text-gray-700 hover:text-gray-800 transition-colors duration-200"
        onClick={handleBack}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Kembali</span>
      </button>
      <h1 className="head_text text-left">
        <span className="blue_gradient">Profil {name} </span>
      </h1>
      <p className="desc text-left">{desc}</p>

      <div className="mt-10 prompt_layout">
        {data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleEdit={() => handleEdit && handleEdit(post)}
            handleDelete={() => handleDelete && handleDelete(post)}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
