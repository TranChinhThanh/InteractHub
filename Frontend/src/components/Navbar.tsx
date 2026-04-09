function Navbar() {
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
          <span
            className="material-symbols-outlined text-gray-700"
            aria-label="Thông báo"
          >
            notifications
          </span>
          <div
            className="h-9 w-9 rounded-full bg-gray-300"
            aria-label="Avatar"
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
