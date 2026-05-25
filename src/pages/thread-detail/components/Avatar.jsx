import { useState } from "react";
import { getInitials } from "./avatarUtils";

export function Avatar({ alt, size = "md", highlighted = false, src = "" }) {
  const [imageFailed, setImageFailed] = useState(false);
  const sizeClass =
    size === "sm"
      ? "h-8 w-8 text-xs"
      : size === "lg"
        ? "h-12 w-12 text-base"
        : "h-11 w-11 text-sm";
  const borderClass = highlighted
    ? "border-[--color-primary]"
    : "border-[#e5e7eb]";

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border-2 bg-[--color-light-blue] text-[--color-primary] font-bold select-none ${sizeClass} ${borderClass}`}
      aria-label={alt}>
      {src && !imageFailed ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(alt)
      )}
    </div>
  );
}
