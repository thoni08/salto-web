import { Link } from "react-router-dom";

const defaultNavItems = [
  { label: "Beranda", href: "/" },
  { label: "Diskusi", href: "/thread/25-885" },
  { label: "Live", href: "/live" },
];

export function SiteHeader({
  activeHref,
  authActions = [],
  navItems = defaultNavItems,
  className = "",
}) {
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

        <div className="hidden items-center gap-2 md:flex">
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
        </div>
      </div>
    </header>
  );
}
