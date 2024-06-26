export const PromptSkeleton = () => {
  return (
    <div className="skeleton_card">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-400 h-12 w-12"></div>
        <div className="flex-1 space-y-8 py-1">
          <div className="h-2 bg-gray-400 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-gray-400 rounded col-span-2"></div>
              <div className="h-2 bg-gray-400 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-gray-400 rounded"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-gray-400 rounded col-span-2"></div>
            <div className="h-2 bg-gray-400 rounded col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
