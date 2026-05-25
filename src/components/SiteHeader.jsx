import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  clearAuthSession,
  getAuthToken,
  getAuthUser,
} from "../services/authStorage.js";
import {
  LIVE_COMING_SOON_LABEL,
  LIVE_FEATURE_ENABLED,
} from "../config/features.js";

const defaultNavItems = [
  { label: "Beranda", href: "/" },
  { label: "Diskusi", href: "/thread" },
  {
    label: "Live",
    href: "/live",
    disabled: !LIVE_FEATURE_ENABLED,
    badge: !LIVE_FEATURE_ENABLED ? LIVE_COMING_SOON_LABEL : "",
  },
];

function getAvatarUrl(user) {
  const source = user?.data || user?.user || user || {};

  return (
    source.avatar ||
    source.Avatar ||
    source.photoUrl ||
    source.profileImage ||
    source.image ||
    ""
  );
}

export function SiteHeader({
  activeHref,
  authActions = [],
  navItems = defaultNavItems,
  user = null,
  className = "",
}) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [sessionUser, setSessionUser] = useState(() => {
    const token = getAuthToken();
    if (!token) return null;
    return user ?? getAuthUser();
  });
  const [avatarLoaded, setAvatarLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const syncSessionUser = async () => {
      const storedUser = getAuthUser();
      const token = getAuthToken();

      if (!token) {
        if (isMounted) {
          setSessionUser(null);
        }
        return;
      }

      try {
        const response = await fetch("https://salto-be.aauaah.tech/api/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal memuat data profil");
        }

        const result = await response.json();
        if (isMounted) {
          setSessionUser({
            ...(storedUser || {}),
            avatar: getAvatarUrl({
              ...(storedUser || {}),
              ...(result?.data || {}),
            }),
          });
        }
      } catch {
        if (isMounted) {
          setSessionUser(storedUser);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncSessionUser();
      }
    };

    window.addEventListener("storage", syncSessionUser);
    window.addEventListener("focus", syncSessionUser);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      window.removeEventListener("storage", syncSessionUser);
      window.removeEventListener("focus", syncSessionUser);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setSessionUser(null);
    setShowProfileMenu(false);
    navigate("/");
  };

  const avatarSrc = getAvatarUrl(sessionUser);
  const hasSession = Boolean(getAuthToken());
  const resolvedAuthActions =
    !hasSession && authActions.length === 0
      ? [
          { label: "Masuk", to: "/login", variant: "outline" },
          { label: "Daftar", to: "/signup", variant: "solid" },
        ]
      : authActions;

  useEffect(() => {
    setAvatarLoaded(false);
  }, [avatarSrc]);

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
                <span className="inline-flex items-center gap-1.5">
                  {item.label}
                  {item.badge ? (
                    <span className="rounded-full bg-[#f1f5f9] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#64748b]">
                      Soon
                    </span>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {hasSession ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                aria-label="Buka menu profil"
                className="inline-flex items-center transition">
                {avatarSrc ? (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                    {!avatarLoaded && (
                      <div className="absolute inset-0 animate-pulse rounded-full bg-(--color-gray)" />
                    )}
                    <img
                      src={avatarSrc}
                      alt="Profil pengguna"
                      onLoad={() => setAvatarLoaded(true)}
                      onError={() => setAvatarLoaded(true)}
                      className={`h-8 w-8 rounded-full object-cover transition-opacity ${
                        avatarLoaded ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--color-gray) text-(--color-dark)">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-40 rounded-lg bg-white shadow-lg overflow-hidden">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex w-full items-center px-4 py-3 text-[14px] text-(--color-dark) transition hover:bg-[#f8fafc]">
                    Lihat Profil
                  </Link>
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
              {resolvedAuthActions.map((action) => {
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
