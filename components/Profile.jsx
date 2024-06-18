import PromptCard from "./PromptCard";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { convertToIndonesianMonthYear } from "@utils/helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faLocation } from "@fortawesome/free-solid-svg-icons";
import { CustomFieldName } from "./CustomFieldName";
import ZoomModal from "./modals/ZoomModal";
import { useState } from "react";
import { useSession } from "next-auth/react";

const Profile = ({
  data,
  handleEdit,
  handleDelete,
  profile,
  loading,
  isDarkMode,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <section className="relative w-full my-20">
      
      {isModalOpen && (
        <ZoomModal
          src={profile?.userId?.image}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="flex justify-between items-end relative z-10 mt-[18vh]">
        {loading ? (
          <div className=" flex space-x-4">
            <div className="rounded-full bg-gray-500 h-[9vh] w-[9vh]"></div>
          </div>
        ) : (
          <Image
            src={profile?.userId?.image}
            width={80}
            height={80}
            className="rounded-full cursor-pointer my-4"
            alt="profile"
            onClick={() => setIsModalOpen(true)}
          />
        )}
        {profile?.userId?._id === session?.user.id && session?.user && (
          <button
            onClick={() => router.push("/profile/edit")}
            className={`px-5 py-1.5 text-sm ${
              !isDarkMode ? "black_btn" : "white_btn"
            } rounded-full  h-fit mb-4`}
          >
            Ubah Profile
          </button>
        )}
      </div>

      <div className="flex flex-col mt-2">
        <span className="font-satoshi font-semibold text-xl">
          <CustomFieldName
            loading={loading}
            value={profile?.userId?.username ?? "-"}
          />
        </span>
        <CustomFieldName loading={loading} value={profile?.fullName ?? "-"} />
      </div>

      <div className="flex flex-col mt-2 ">
        <p className=" break-all desc text-left mb-4">{profile?.bio}</p>
        <div className="flex gap-2 text-sm items-center">
          {profile?.location !== "" && <FontAwesomeIcon icon={faLocation} />}
          <CustomFieldName loading={loading} value={profile?.location ?? "-"} />
        </div>
        <div className="flex gap-2 text-sm items-center">
          <FontAwesomeIcon icon={faCalendar} />
          <CustomFieldName
            loading={loading}
            value={`bergabung ${convertToIndonesianMonthYear(
              profile?.userId?.createdAt
            )}`}
          />
        </div>
      </div>

      <div className=" mt-2 prompt_layout">
        <p className="desc text-left font-semibold">Postingan</p>
        {data.length > 0 ? (
          data.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
            />
          ))
        ) : (
          <p className="text-center text-sm my-10 py-10">
            Postingan masih kosong
          </p>
        )}
      </div>
    </section>
  );
};

export default Profile;
