export function AuthField({ id, label, error, children }) {
  const hasError = Boolean(error);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-(--color-dark)">
        {label}
      </label>

      <div>{children}</div>

      {hasError ? (
        <p
          id={`${id}-error`}
          aria-live="polite"
          className="text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
