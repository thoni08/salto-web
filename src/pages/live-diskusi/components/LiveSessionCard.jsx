export function LiveSessionCard({ title, subtitle, host, time }) {
  return (
    <div className="rounded-[22px] border border-(--color-light-blue)/70 bg-white/92 p-4 shadow-[0_25px_55px_-28px_rgba(37,52,63,.26)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="mb-1 text-[1rem] font-extrabold text-(--color-dark)">
            {title}
          </h3>
          <p className="text-[0.88rem] leading-6 text-(--color-secondary)">
            {subtitle}
          </p>
        </div>
        <span className="inline-flex rounded-full bg-(--color-like-blue)/15 px-3 py-1 text-[0.78rem] font-bold text-(--color-like-blue)">
          {time}
        </span>
      </div>
      <div className="mt-3 text-[0.84rem] text-[#52606d]">Host: {host}</div>
    </div>
  );
}
