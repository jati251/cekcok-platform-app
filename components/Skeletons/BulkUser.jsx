import { PromptSkeleton } from "./PromptCardSkeleton";
import { UserSkeleton } from "./UserCardSkeleton";

export const BulkUserSkeleton = () => {
  return (
    <div className="mb-16 prompt_layout w-full px-6">
      <UserSkeleton />
      <UserSkeleton />
      <UserSkeleton />
      <UserSkeleton />
      <UserSkeleton />
    </div>
  );
};

export const BulkPrompt = () => (
  <div className="mb-16 prompt_layout w-full px-6">
    <PromptSkeleton />
    <PromptSkeleton />
    <PromptSkeleton />
    <PromptSkeleton />
    <PromptSkeleton />
  </div>
);
