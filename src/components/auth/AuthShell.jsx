export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  cardClassName = "max-w-120",
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-(--color-gray) px-4 py-10 font-sans">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at top, var(--color-light-blue), transparent 42%), radial-gradient(circle at bottom, var(--color-light-blue), transparent 36%)",
        }}
      />

      <section
        className={`relative w-full rounded-3xl border border-(--color-gray) bg-white p-6 backdrop-blur-sm ${cardClassName}`}
        aria-label={title}>
        <header className="mb-5 text-center">
          <h1 className="text-[1.7rem] font-extrabold tracking-tight text-(--color-dark)">
            {title}
          </h1>
          <p className="text-[0.92rem] leading-relaxed text-(--color-secondary)">
            {subtitle}
          </p>
        </header>

        {children}

        {footer ? footer : null}
      </section>
    </main>
  );
}
