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
import Loading from "@app/profile/loading";

const Profile = ({
  data,
  handleEdit,
  handleDelete,
  profile,
  loading,
  isDarkMode,
  fetchProfile,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session, status } = useSession();

  const handleFollow = async (val) => {
    try {
      if (val === "follow") {
        const response = await fetch("/api/users/followuser", {
          method: "POST",
          body: JSON.stringify({
            followerId: session.user.id,
            followingId: profile._id,
          }),
        });

        if (response.ok) {
          if (profile?.userId?._id !== session?.user.id)
            await fetch(`/api/notif`, {
              method: "POST",
              body: JSON.stringify({
                recipientId: profile?.userId?._id,
                senderId: session.user.id,
                type: "follow",
                data: { username: profile?.userId?.username },
              }),
            });

          fetchProfile();
        } else {
          throw new Error("Failed to update profile");
        }
      } else {
        const response = await fetch("/api/users/unfollowuser", {
          method: "POST",
          body: JSON.stringify({
            followerId: session.user.id,
            followingId: profile._id,
          }),
        });
        if (response.ok) {
          fetchProfile();
        } else {
          throw new Error("Failed to update profile");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAction = () => {
    if (profile.isFollowing) {
      handleFollow("unfollow");
    } else {
      handleFollow("follow");
    }
  };

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
            <div className=" rounded-full bg-gray-500 h-[9vh] w-[9vh]"></div>
          </div>
        ) : (
          <Image
            src={profile?.userId?.image || "/assets/images/default-user.png"}
            width={80}
            height={80}
            className="rounded-full cursor-pointer my-4"
            alt="profile"
            onClick={() => setIsModalOpen(true)}
          />
        )}
        {profile?.userId?._id === session?.user.id && session?.user ? (
          <button
            onClick={() => router.push("/profile/edit")}
            className={`px-5 py-1.5 text-sm ${
              !isDarkMode ? "black_btn" : "white_btn"
            } rounded-full  h-fit mb-4`}
          >
            Ubah Profile
          </button>
        ) : (
          <>
            {!loading &&
              status !== "loading" &&
              session?.user &&
              profile._id && (
                <button
                  onClick={handleAction}
                  className={`px-5 py-1.5 text-sm ${
                    !isDarkMode ? "black_btn" : "white_btn"
                  } rounded-full  h-fit mb-4 `}
                >
                  {profile?.isFollowing
                    ? "Unfollow"
                    : profile?.followBack
                    ? "Follow Back"
                    : "Follow"}
                </button>
              )}
          </>
        )}
      </div>

      <div className="flex flex-col mt-2">
        <span className="font-satoshi font-semibold text-xl">
          <CustomFieldName
            loading={loading}
            value={profile?.userId?.fullName ?? "-"}
          />
        </span>
        <div className="text-gray-400">
          <CustomFieldName
            loading={loading}
            value={
              profile?.userId?.username ? "@" + profile?.userId?.username : "-"
            }
          />
        </div>
      </div>

      <div className="flex flex-col mt-2 ">
        <p className=" break-all desc text-left mb-4">{profile?.bio}</p>
        <div className="text-gray-400 flex gap-2 text-sm items-center">
          {profile?.location !== "" && <FontAwesomeIcon icon={faLocation} />}
          <CustomFieldName loading={loading} value={profile?.location ?? "-"} />
        </div>
        <div className="flex gap-2 text-sm items-center text-gray-400">
          <FontAwesomeIcon icon={faCalendar} />
          <CustomFieldName
            loading={loading}
            value={`bergabung ${convertToIndonesianMonthYear(
              profile?.userId?.createdAt
            )}`}
          />
        </div>

        <div className=" font-satoshi flex gap-2 mt-3">
          <div className="flex gap-2 text-sm items-center">
            <span className="font-semibold ">
              <CustomFieldName
                width={"w-10"}
                loading={loading}
                value={profile.followerCount}
              />
            </span>
            <span className="text-gray-400">Followers</span>
          </div>
          <div className="flex gap-2 text-sm items-center ">
            <span className="font-semibold ">
              <CustomFieldName
                width={"w-10"}
                loading={loading}
                value={profile.followingCount}
              />
            </span>
            <span className="text-gray-400">Following</span>
          </div>
        </div>
      </div>

      <div className=" mt-2 prompt_layout">
        <p className="desc text-left font-semibold">Postingan</p>
        {data.length > 0 &&
          data.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleEdit={() => handleEdit && handleEdit(post)}
              handleDelete={() => handleDelete && handleDelete(post)}
            />
          ))}
        {data.length === 0 && !loading && (
          <p className="text-center text-sm my-10 py-10">
            Postingan masih kosong
          </p>
        )}
        {loading && <Loading isDarkMode={isDarkMode} />}
      </div>
    </section>
  );
};

export default Profile;
