import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Radio, User, LogIn } from "lucide-react";
import { Icon } from "../pages/thread-detail/components/Icon";
import { useScrollDirection } from "../hooks/useScrollDirection";

export function MobileNavbar() {
  const location = useLocation();
  const scrollDirection = useScrollDirection();
  const isAuthenticated = localStorage.getItem("authToken");

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Beranda" },
    { path: "/thread/25-885", icon: MessageSquare, label: "Diskusi" },
    { path: "/live", icon: Radio, label: "Live" },
  ];

  return (
    <nav
      className={`fixed left-1/2 z-50 grid w-[calc(100%-3rem)] max-w-sm -translate-x-1/2 grid-cols-4 items-center gap-1 rounded-4xl border border-(--color-light-blue)/70 bg-white/90 px-2 py-2.5 shadow-lg shadow-(--color-light-blue)/30 backdrop-blur-md transition-all duration-300 md:hidden ${
        scrollDirection === "down" ? "-bottom-25" : "bottom-6"
      }`}
      aria-label="Mobile navigation">
      {navItems.map(({ path, icon, label }) => {
        const active = isActive(path);

        return (
          <Link
            key={path}
            to={path}
            className={`mx-auto flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 transition-all ${
              active
                ? "text-(--color-like-blue) relative"
                : "text-(--color-secondary) hover:text-(--color-dark)"
            }`}
            aria-current={active ? "page" : undefined}
            title={label}>
            {active && (
              <span className="absolute -top-1.5 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-(--color-like-blue)" />
            )}
            <Icon
              icon={icon}
              className={`h-5 w-5 ${active ? "stroke-[2.5px]" : "stroke-[1.8px]"}`}
            />
            <span
              className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>
              {label}
            </span>
          </Link>
        );
      })}

      <a
        href="#"
        className={`mx-auto flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 transition-all ${
          isActive("/profile") || isActive("/login")
            ? "text-(--color-like-blue) relative"
            : "text-(--color-secondary) hover:text-(--color-dark)"
        }`}
        title={isAuthenticated ? "Profil" : "Masuk"}
        aria-label={isAuthenticated ? "Profil" : "Masuk"}>
        {(isActive("/profile") || isActive("/login")) && (
          <span className="absolute -top-1.5 left-1/2 h-1 w-5 -translate-x-1/2 rounded-full bg-(--color-like-blue)" />
        )}
        <Icon
          icon={isAuthenticated ? User : LogIn}
          className={`h-5 w-5 ${isActive("/profile") || isActive("/login") ? "stroke-[2.5px]" : "stroke-[1.8px]"}`}
        />
        <span
          className={`text-[10px] ${isActive("/profile") || isActive("/login") ? "font-bold" : "font-medium"}`}>
          {isAuthenticated ? "Profil" : "Masuk"}
        </span>
      </a>
    </nav>
  );
}
