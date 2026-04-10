import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { searchUsers } from "../services/userService";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const normalizedQuery = query.trim();

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchUsers(query),
    enabled: normalizedQuery.length > 0,
  });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        Kết quả tìm kiếm cho: "{query}"
      </h1>

      {normalizedQuery.length === 0 && (
        <p className="text-sm text-gray-600">Vui lòng nhập từ khóa tìm kiếm.</p>
      )}

      {normalizedQuery.length > 0 && isLoading && (
        <p className="text-sm text-gray-600">Đang tải kết quả tìm kiếm...</p>
      )}

      {normalizedQuery.length > 0 && isError && (
        <p className="text-sm text-red-600">Đã xảy ra lỗi khi tìm kiếm user.</p>
      )}

      {normalizedQuery.length > 0 &&
        !isLoading &&
        !isError &&
        users.length === 0 && (
          <p className="text-sm text-gray-600">Không tìm thấy user nào.</p>
        )}

      {normalizedQuery.length > 0 &&
        !isLoading &&
        !isError &&
        users.length > 0 && (
          <ul className="space-y-3">
            {users.map((user) => {
              const displayName = user.userName || "Unknown User";

              return (
                <li
                  key={user.id}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
                >
                  <Link
                    to={`/profile/${user.id}`}
                    className="h-10 w-10 overflow-hidden rounded-full bg-gray-200"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>

                  <Link
                    to={`/profile/${user.id}`}
                    className="text-sm font-semibold text-gray-800 hover:underline"
                  >
                    {displayName}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
    </section>
  );
}

export default SearchPage;
