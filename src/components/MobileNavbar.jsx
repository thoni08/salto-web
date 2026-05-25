import { Home, LogIn, MessageSquare, Radio, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useScrollDirection } from "../hooks/useScrollDirection";
import { Icon } from "../pages/thread-detail/components/Icon";
import { getAuthToken } from "../services/authStorage.js";
import { LIVE_FEATURE_ENABLED } from "../config/features.js";

export function MobileNavbar() {
  const location = useLocation();
  const scrollDirection = useScrollDirection();
  const isAuthenticated = Boolean(getAuthToken());

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const navItems = [
    { path: "/", icon: Home, label: "Beranda" },
    { path: "/thread", icon: MessageSquare, label: "Diskusi" },
    { path: "/live", icon: Radio, label: "Live", disabled: !LIVE_FEATURE_ENABLED },
  ];

  return (
    <nav
      className={`fixed left-3 right-3 z-50 mx-auto grid max-w-[430px] grid-cols-4 items-center gap-1 rounded-[28px] border border-[#dbe4f3] bg-white/95 px-2 py-2 shadow-[0_18px_44px_-22px_rgba(10,38,71,0.55)] backdrop-blur-xl transition-all duration-300 md:hidden ${
        scrollDirection === "down"
          ? "-bottom-28"
          : "bottom-[calc(0.75rem+env(safe-area-inset-bottom))]"
      }`}
      aria-label="Mobile navigation">
      {navItems.map(({ path, icon, label, disabled }) => {
        const active = isActive(path);

        return (
          <Link
            key={path}
            to={path}
            className={`relative mx-auto flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 transition-all ${
              active
                ? "bg-[#eef4ff] text-(--color-like-blue)"
                : "text-(--color-secondary) hover:bg-[#f8fbff] hover:text-(--color-dark)"
            }`}
            aria-current={active ? "page" : undefined}
            title={label}>
            <Icon
              icon={icon}
              className={`h-5 w-5 ${active ? "stroke-[2.5px]" : "stroke-[1.8px]"}`}
            />
            <span className="relative">
              <span
                className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>
                {label}
              </span>
              {disabled ? (
                <span className="absolute -right-2 -top-1 h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
              ) : null}
            </span>
          </Link>
        );
      })}

      <Link
        to={isAuthenticated ? "/profile" : "/login"}
        className={`relative mx-auto flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 transition-all ${
          isActive("/profile") || isActive("/login")
            ? "bg-[#eef4ff] text-(--color-like-blue)"
            : "text-(--color-secondary) hover:bg-[#f8fbff] hover:text-(--color-dark)"
        }`}
        title={isAuthenticated ? "Profil" : "Masuk"}
        aria-label={isAuthenticated ? "Profil" : "Masuk"}>
        <Icon
          icon={isAuthenticated ? User : LogIn}
          className={`h-5 w-5 ${isActive("/profile") || isActive("/login") ? "stroke-[2.5px]" : "stroke-[1.8px]"}`}
        />
        <span
          className={`text-[10px] ${isActive("/profile") || isActive("/login") ? "font-bold" : "font-medium"}`}>
          {isAuthenticated ? "Profil" : "Masuk"}
        </span>
      </Link>
    </nav>
  );
}
