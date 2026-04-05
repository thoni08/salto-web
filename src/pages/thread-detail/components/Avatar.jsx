import { getInitials } from "./avatarUtils";

export function Avatar({ alt, size = "md", highlighted = false }) {
  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-base"
      : size === "lg"
        ? "h-12 w-12 text-xl"
        : "h-11 w-11 text-lg";
  const borderClass = highlighted
    ? "border-[--color-primary]"
    : "border-[#e5e7eb]";

  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 bg-[--color-light-blue] text-[--color-primary] font-bold select-none ${sizeClass} ${borderClass}`}
      aria-label={alt}>
      {getInitials(alt)}
    </div>
  );
}
