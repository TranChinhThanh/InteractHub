import { useQuery } from "@tanstack/react-query";
import { getTrendingHashtags } from "../services/hashtagService";

const normalizeHashtag = (hashtag: string): string => {
  const trimmedHashtag = hashtag.trim();

  if (trimmedHashtag.length === 0) {
    return "#";
  }

  return trimmedHashtag.startsWith("#") ? trimmedHashtag : `#${trimmedHashtag}`;
};

function RightSidebar() {
  const {
    data: hashtags = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trending-hashtags"],
    queryFn: () => getTrendingHashtags(5),
    staleTime: 1000 * 60,
  });

  return (
    <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Xu hướng</h2>

      {isLoading ? (
        <p className="mt-3 text-sm text-gray-500">Đang tải xu hướng...</p>
      ) : null}

      {isError ? (
        <p className="mt-3 text-sm text-red-600">
          Không thể tải hashtag xu hướng.
        </p>
      ) : null}

      {!isLoading && !isError && hashtags.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">Chưa có hashtag xu hướng.</p>
      ) : null}

      {!isLoading && !isError && hashtags.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {hashtags.map((hashtag) => {
            const normalizedHashtag = normalizeHashtag(hashtag);

            return (
              <li
                key={normalizedHashtag}
                className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  · Đang thịnh hành
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  {normalizedHashtag}
                </p>
                {/* <p className="mt-1 text-xs text-gray-500">
                  {fakePostCount}.2k bài viết
                </p> */}
              </li>
            );
          })}
        </ul>
      ) : null}
    </aside>
  );
}

export default RightSidebar;
