function PostSkeleton() {
  return (
    <article className="animate-pulse rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <header className="mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-3 w-28 rounded-md bg-gray-200" />
          <div className="h-2.5 w-20 rounded-md bg-gray-200" />
        </div>
      </header>

      <div className="space-y-2">
        <div className="h-3 w-full rounded-md bg-gray-200" />
        <div className="h-3 w-11/12 rounded-md bg-gray-200" />
        <div className="h-3 w-3/4 rounded-md bg-gray-200" />
      </div>

      <div className="mt-4 h-64 w-full rounded-2xl bg-gray-200" />

      <footer className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3">
        <div className="h-7 w-16 rounded-full bg-gray-200" />
        <div className="h-7 w-16 rounded-full bg-gray-200" />
        <div className="h-7 w-16 rounded-full bg-gray-200" />
      </footer>
    </article>
  );
}

export default PostSkeleton;
