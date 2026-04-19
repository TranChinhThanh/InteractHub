import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDebounce } from "../hooks/useDebounce";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userInitial = user?.username?.trim().charAt(0).toUpperCase() || "U";
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const lastNavigatedSearch = useRef("");

  useEffect(() => {
    const normalizedSearch = debouncedSearch.trim();

    if (normalizedSearch.length === 0) {
      lastNavigatedSearch.current = "";
      return;
    }

    if (normalizedSearch === lastNavigatedSearch.current) {
      return;
    }

    lastNavigatedSearch.current = normalizedSearch;
    navigate(`/search?q=${encodeURIComponent(normalizedSearch)}`);
  }, [debouncedSearch, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-3 lg:px-6">
        <Link
          to="/"
          className="shrink-0 text-xl font-extrabold text-blue-600 transition hover:text-blue-700"
        >
          InteractHub
        </Link>

        <div className="relative w-full max-w-xl">
          <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm trên InteractHub"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-full border border-transparent bg-gray-100 py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/notifications"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-blue-600"
            aria-label="Thông báo"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              aria-hidden="true"
            >
              notifications
            </span>
          </Link>

          {user?.id ? (
            <Link
              to={`/profile/${user.id}`}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-blue-200 bg-white text-xs font-semibold text-blue-700 transition hover:border-blue-400"
              aria-label="Trang cá nhân"
            >
              {userInitial}
            </Link>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-600">
              {userInitial}
            </span>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="hidden rounded-full border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-400 hover:text-gray-800 md:inline-flex"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
