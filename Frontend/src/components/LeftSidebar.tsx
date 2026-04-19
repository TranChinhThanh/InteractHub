import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type IconProps = {
  className?: string;
};

const HomeIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M3 10.5L12 3L21 10.5V20.25C21 20.6642 20.6642 21 20.25 21H14.25C13.8358 21 13.5 20.6642 13.5 20.25V15.75C13.5 15.3358 13.1642 15 12.75 15H11.25C10.8358 15 10.5 15.3358 10.5 15.75V20.25C10.5 20.6642 10.1642 21 9.75 21H3.75C3.33579 21 3 20.6642 3 20.25V10.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BellIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M6.75 9.75C6.75 6.85051 9.10051 4.5 12 4.5C14.8995 4.5 17.25 6.85051 17.25 9.75V12.5314C17.25 13.2276 17.4576 13.9081 17.8464 14.4856L19.125 16.3828V17.25H4.875V16.3828L6.15363 14.4856C6.54244 13.9081 6.75 13.2276 6.75 12.5314V9.75Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.75 17.25C9.75 18.4926 10.7574 19.5 12 19.5C13.2426 19.5 14.25 18.4926 14.25 17.25"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M12 12C14.4853 12 16.5 9.98528 16.5 7.5C16.5 5.01472 14.4853 3 12 3C9.51472 3 7.5 5.01472 7.5 7.5C7.5 9.98528 9.51472 12 12 12Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 20.25C4.5 17.7647 7.85786 15.75 12 15.75C16.1421 15.75 19.5 17.7647 19.5 20.25"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function LeftSidebar() {
  const { user } = useAuth();

  const navItems = [
    {
      label: "Trang chủ",
      to: "/",
      icon: HomeIcon,
      end: true,
    },
    {
      label: "Thông báo",
      to: "/notifications",
      icon: BellIcon,
      end: false,
    },
    {
      label: "Trang cá nhân",
      to: "/profile/" + user?.id,
      icon: UserIcon,
      end: false,
    },
  ];

  return (
    <aside className="space-y-4">
      <nav
        aria-label="Điều hướng sidebar"
        className="rounded-3xl border border-gray-200 bg-white p-2.5 shadow-sm"
      >
        <ul className="space-y-1">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <li key={label}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-blue-600",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={[
                        "flex h-8 w-8 items-center justify-center rounded-xl",
                        isActive
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-500",
                      ].join(" ")}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 via-blue-50 to-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
          The Digital Atelier
        </p>
        <p className="mt-2 font-medium">
          Khám phá không gian sáng tạo dành cho bạn.
        </p>
      </div>
    </aside>
  );
}

export default LeftSidebar;
