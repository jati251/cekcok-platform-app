"use client";

import { useDarkModeContext } from "@app/context/DarkModeProvider";
import Loading from "@app/profile/loading";
import { PromptSkeleton } from "@components/Skeletons/PromptCardSkeleton";
import Comment from "@components/cards/Comment";
import PromptCard from "@components/cards/PromptCard";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CommentDetail = ({ params }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { isDarkMode } = useDarkModeContext();

  const [post, setPost] = useState({
    _id: null,
    prompt: "",
    tag: "",
    hates: "",
    comments: "",
    likes: "",
    creator: {},
    hated: false,
    liked: false,
  });
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const promptId = params.id;

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const getPromptDetails = async () => {
      if (!promptId) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/prompt/${promptId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch prompt details");
        }
        const data = await response.json();
        if (session?.user) {
          const userId = session?.user.id;

          const userInteraction = data.userInteractions.find(
            (interaction) => interaction.userId.toString() === userId
          );

          if (userInteraction) {
            data.liked = userInteraction.action === "like";
            data.hated = userInteraction.action === "hate";
          } else {
            data.liked = false;
            data.hated = false;
          }
        } else {
          data.liked = false;
          data.hated = false;
        }

        setPost({
          _id: data._id,
          prompt: data.prompt,
          tag: data.tag,
          hates: data.hates,
          comments: data.comments,
          likes: data.likes,
          creator: data.creator,
          userInteractions: data.userInteractions,
          liked: data.liked,
          createdAt: data.createdAt,
          media: data.media,
          hated: data.hated,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prompt details:", error);
      }
    };

    if (promptId && status !== "loading") getPromptDetails();
  }, [promptId, status]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${promptId}`, {
        method: "POST",
        body: JSON.stringify({
          postId: promptId,
        }),
      });
      const data = await response.json();

      if (session?.user) {
        const userId = session.user.id;

        data.forEach((comment) => {
          const userInteraction = comment.userInteractions.find(
            (interaction) => interaction.userId.toString() === userId
          );
          comment.liked = userInteraction?.action === "like";
          comment.hated = userInteraction?.action === "hate";
        });
      } else {
        data.forEach((comment) => {
          comment.liked = false;
          comment.hated = false;
        });
      }

      setComments(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    if (promptId && status !== "loading") fetchComments();
  }, [post]);

  return (
    <section className="feed mb-14">
      <div className="mt-14 w-full px-4">
        <button
          className="my-6 flex font-satoshi items-center gap-4 hover:text-gray-400 transition-colors duration-200"
          onClick={handleBack}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Kembali</span>
        </button>

        {post._id ? (
          <PromptCard
            key={promptId}
            post={post}
            isDetail
            fetchComment={fetchComments}
          />
        ) : (
          <PromptSkeleton />
        )}
        <div className="mt-6">
          <h4 className="font-satoshi mb-10 font-semibold text-lg">Komentar</h4>
          <div className=" mt-2 border-b border-[#2f3336] mb-10">
            {comments.map((comment, i) => (
              <Comment
                isDarkMode={isDarkMode}
                key={`${i + 1}_${comment._id}`}
                comment={comment}
              />
            ))}
          </div>
          {loading && <Loading isDarkMode={isDarkMode} />}
        </div>
      </div>
    </section>
  );
};

export default CommentDetail;
