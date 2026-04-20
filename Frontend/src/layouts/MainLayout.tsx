import { Outlet } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar";
import Navbar from "../components/Navbar";
import RightSidebar from "../components/RightSidebar";

function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <Navbar />

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 px-3 pb-8 pt-20 lg:grid-cols-[17rem_minmax(0,1fr)_18rem] lg:px-6">
        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <LeftSidebar />
          </div>
        </aside>

        <main className="min-h-[calc(100vh-7rem)]">
          <Outlet />
        </main>

        <aside className="hidden lg:block">
          <div className="sticky top-20">
            <RightSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MainLayout;
