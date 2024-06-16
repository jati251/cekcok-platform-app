export const PromptSkeleton = () => {
  return (
    <div class="prompt_card">
      <div class="animate-pulse flex space-x-4">
        <div class="rounded-full bg-sky-800 h-12 w-12"></div>
        <div class="flex-1 space-y-8 py-1">
          <div class="h-2 bg-sky-800 rounded"></div>
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-4">
              <div class="h-2 bg-sky-800 rounded col-span-2"></div>
              <div class="h-2 bg-sky-800 rounded col-span-1"></div>
            </div>
            <div class="h-2 bg-sky-800 rounded"></div>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div class="h-2 bg-sky-800 rounded col-span-2"></div>
            <div class="h-2 bg-sky-800 rounded col-span-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
