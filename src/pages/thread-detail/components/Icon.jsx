export function Icon({
  icon: IconComp,
  className = "h-4 w-4",
  strokeWidth = 1.8,
}) {
  if (!IconComp) return null;

  return (
    <IconComp
      className={`block shrink-0 ${className}`}
      strokeWidth={strokeWidth}
      aria-hidden="true"
    />
  );
}
