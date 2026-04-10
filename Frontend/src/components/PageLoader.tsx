function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-700">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        <span className="text-sm font-medium">Đang tải...</span>
      </div>
    </div>
  );
}

export default PageLoader;