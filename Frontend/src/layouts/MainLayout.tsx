import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 px-4 pb-6 pt-20 lg:grid-cols-[20%_55%_25%]">
        <aside className="min-h-[180px] rounded-xl bg-blue-100 p-4">
          LeftSidebar
        </aside>

        <main className="min-h-[calc(100vh-7rem)] rounded-xl bg-amber-50 p-4">
          {children}
        </main>

        <aside className="min-h-[180px] rounded-xl bg-green-100 p-4">
          RightSidebar
        </aside>
      </div>
    </div>
  );
}

export default MainLayout;
