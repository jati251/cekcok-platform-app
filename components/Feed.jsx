"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import { useSession } from "next-auth/react";
import { PromptSkeleton } from "./Skeletons/PromptCardSkeleton";

const PromptCardList = ({ data, handleTagClick, status }) => {
  return (
    <div className="mt-16 prompt_layout">
      {status ? (
        [...Array(4)].map((_, index) => (
          <PromptSkeleton key={`skeleton_${index + 1}`} />
        ))
      ) : (
        <>
          {data.map((post) => (
            <PromptCard
              key={post._id}
              post={post}
              handleTagClick={handleTagClick}
            />
          ))}
        </>
      )}
    </div>
  );
};

const Feed = () => {
  const [allPosts, setAllPosts] = useState([]);
  const { data: session, status } = useSession();

  // Search states
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();

    if (session?.user) {
      const userId = session?.user.id;

      data.forEach((post) => {
        const userInteraction = post.userInteractions.find(
          (interaction) => interaction.userId.toString() === userId
        );
        if (userInteraction) {
          post.liked = userInteraction.action === "like";
          post.hated = userInteraction.action === "hate";
        } else {
          post.liked = false;
          post.hated = false;
        }
      });
    } else {
      data.forEach((post) => {
        post.liked = false;
        post.hated = false;
      });
    }

    setAllPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (status !== "loading") {
      fetchPosts();
    }
  }, [status]);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i");
    return allPosts.filter(
      (item) =>
        regex.test(item?.creator?.username ?? item?.author?.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : (
        <PromptCardList
          data={allPosts}
          status={loading}
          handleTagClick={handleTagClick}
        />
      )}
    </section>
  );
};

export default Feed;
