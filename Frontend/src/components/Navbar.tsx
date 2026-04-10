import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4">
        <div className="shrink-0 text-xl font-bold text-gray-900">
          InteractHub
        </div>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="w-full max-w-md rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 outline-none focus:border-blue-500 focus:bg-white"
        />

        <div className="flex shrink-0 items-center gap-3">
          <Link
            to="/notifications"
            className="flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-700 transition hover:text-blue-700"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              notifications
            </span>
            <span>Thông báo</span>
          </Link>
          {user?.id ? (
            <Link
              to={`/profile/${user.id}`}
              className="cursor-pointer text-sm font-medium text-gray-700 hover:underline"
            >
              Xin chào, {user?.username}
            </Link>
          ) : (
            <span className="text-sm font-medium text-gray-700">
              Xin chào, {user?.username}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-200"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
