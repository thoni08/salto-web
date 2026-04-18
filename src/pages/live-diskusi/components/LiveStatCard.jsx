export function LiveStatCard({ value, label }) {
  return (
    <div className="rounded-[18px] border border-(--color-light-blue)/70 bg-white/80 p-4 shadow-[0_12px_24px_-22px_rgba(37,52,63,.32)]">
      <strong className="block text-[1.25rem] text-(--color-dark)">
        {value}
      </strong>
      <span className="text-[0.84rem] text-(--color-secondary)">{label}</span>
    </div>
  );
}
