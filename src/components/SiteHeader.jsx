import { LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthSession } from "../services/authStorage.js";

const defaultNavItems = [
  { label: "Beranda", href: "/" },
  { label: "Diskusi", href: "/thread" },
  { label: "Live", href: "/live" },
];

export function SiteHeader({
  activeHref,
  authActions = [],
  navItems = defaultNavItems,
  user = null,
  className = "",
}) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    setShowProfileMenu(false);
    navigate("/");
  };

  const userInitials = user
    ? (user.fullName || user.userName || "")
        .split(/\s+/)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <header
      className={`sticky top-0 z-30 border-b border-(--color-light-blue)/70 bg-(--color-light-blue)/70 backdrop-blur-md ${className}`}>
      <div className="mx-auto flex w-full max-w-316 items-center justify-between gap-4 px-4 py-4 lg:px-0">
        <Link to="/" className="leading-tight">
          <p className="text-[20px] tracking-[2px] font-black">
            <span className="text-(--color-primary)">S</span>
            <span className="text-(--color-dark)">ALTO</span>
          </p>
          <p className="text-[10px] leading-4.5 text-(--color-secondary)">
            Let&apos;s Connect, Grow Together
          </p>
        </Link>

        <nav className="hidden items-center gap-5 text-[14px] leading-4.5 md:flex">
          {navItems.map((item) => {
            const isActive = item.href === activeHref;
            if (item.href === "#") {
              return (
                <span
                  key={item.label}
                  className={`${isActive ? "font-bold text-(--color-dark)" : "text-(--color-dark)"} transition`}>
                  {item.label}
                </span>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`transition hover:text-(--color-like-blue) ${
                  isActive
                    ? "font-bold text-(--color-dark)"
                    : "text-(--color-dark)"
                }`}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="inline-flex items-center gap-2 rounded-full border border-(--color-dark) px-3 py-2 text-[14px] leading-4.5 transition hover:bg-(--color-dark) hover:text-white">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-(--color-dark) text-[12px] font-bold text-white">
                  {userInitials}
                </div>
                <span className="max-w-[120px] truncate text-(--color-dark)">
                  {user.fullName || user.userName || "Profil"}
                </span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-(--color-gray) bg-white shadow-lg">
                  <div className="border-b border-(--color-gray) px-4 py-3">
                    <p className="text-[12px] text-(--color-secondary)">Login sebagai</p>
                    <p className="text-[14px] font-bold text-(--color-dark)">
                      {user.fullName || user.userName}
                    </p>
                    <p className="text-[12px] text-(--color-secondary)">
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-[14px] text-red-600 transition hover:bg-red-50">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {authActions.map((action) => {
                const sharedClass =
                  "rounded-full px-5 py-2 text-[14px] leading-4.5 transition";

                if (action.variant === "solid") {
                  return (
                    <Link
                      key={action.label}
                      to={action.to}
                      className={`${sharedClass} bg-(--color-dark) text-white hover:opacity-90`}>
                      {action.label}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={action.label}
                    to={action.to}
                    className={`${sharedClass} border border-(--color-dark) text-(--color-dark) hover:bg-(--color-dark) hover:text-white`}>
                    {action.label}
                  </Link>
                );
              })}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
