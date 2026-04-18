export function LiveChatMessage({ message, onLike }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-white text-[0.78rem] font-bold text-white shadow-[0_12px_20px_-16px_rgba(37,52,63,.5)]"
        style={{ backgroundColor: message.color }}>
        {message.initials}
      </div>
      <div className="min-w-0">
        <div
          className={`rounded-[18px_18px_18px_6px] border px-4 py-3 text-[0.96rem] leading-7 ${
            message.tone === "host"
              ? "border-[#dbe3f3] bg-[#edf2ff]"
              : message.tone === "alt"
                ? "border-[#dbe3f3] bg-[#f9f9f1]"
                : "border-[#dbe3f3] bg-[#f8fafc]"
          }`}>
          {message.text}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[0.78rem] text-(--color-secondary)">
          <span className="font-medium text-(--color-dark)">
            {message.name}
          </span>
          {message.tag ? (
            <span className="rounded-full bg-(--color-like-blue)/15 px-2 py-0.5 text-[0.72rem] font-bold text-(--color-like-blue)">
              {message.tag}
            </span>
          ) : null}
          <span>{message.time}</span>
          <button
            type="button"
            className="text-inherit transition hover:text-(--color-dark)"
            onClick={onLike}>
            👍 {message.likes}
          </button>
        </div>
      </div>
    </div>
  );
}
