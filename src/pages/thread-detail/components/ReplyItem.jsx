import { ThumbsUp } from "lucide-react";
import { linkFx } from "../constants";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";

export function ReplyItem({ reply }) {
  return (
    <article className="flex items-start gap-3">
      <Avatar alt={reply.author} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-(--color-gray) p-3">
          <div className="flex flex-wrap items-center gap-2 text-[12px] leading-4">
            <p className="font-bold text-(--color-dark)">{reply.author}</p>
            <p className="text-(--color-secondary)">{reply.role}</p>
          </div>
          <p className="mt-2 text-[12px] leading-[19.5px] text-(--color-dark)">
            {reply.text}
          </p>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[12px] leading-4 text-[#9ca3af]">
          <span>{reply.createdAt}</span>
          <span className="inline-flex items-center gap-1">
            <Icon icon={ThumbsUp} className="h-3 w-3" strokeWidth={2} />
            {reply.likes}
          </span>
          <button
            type="button"
            className={`${linkFx} font-semibold hover:text-(--color-dark)`}>
            Balas
          </button>
        </div>
      </div>
    </article>
  );
}
