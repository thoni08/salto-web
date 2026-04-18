import {
  Clock3,
  EllipsisVertical,
  Flag,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";
import { useState } from "react";
import { buttonFx } from "../constants";
import { sanitizeAnswer } from "../dataGuards";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Icon } from "./Icon";
import { ReplyItem } from "./ReplyItem";

function formatReplyCreatedAt() {
  const now = new Date();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = String(now.getDate()).padStart(2, "0");
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} · ${hour}:${minute} WIB`;
}

function normalizeReply(reply, answerId, fallbackText) {
  if (!reply || typeof reply !== "object") {
    return {
      id: `${answerId}-reply-${Date.now()}`,
      author: "Kamu",
      role: "Member",
      text: fallbackText,
      createdAt: formatReplyCreatedAt(),
      likes: 0,
    };
  }

  return {
    id:
      typeof reply.id === "string" && reply.id.trim()
        ? reply.id.trim()
        : `${answerId}-reply-${Date.now()}`,
    author:
      typeof reply.author === "string" && reply.author.trim()
        ? reply.author.trim()
        : "Kamu",
    role:
      typeof reply.role === "string" && reply.role.trim()
        ? reply.role.trim()
        : "Member",
    text:
      typeof reply.text === "string" && reply.text.trim()
        ? reply.text.trim()
        : fallbackText,
    createdAt:
      typeof reply.createdAt === "string" && reply.createdAt.trim()
        ? reply.createdAt.trim()
        : formatReplyCreatedAt(),
    likes: Number.isFinite(reply.likes) ? reply.likes : 0,
  };
}

export function AnswerCard({ answer, onLikeToggle, onReplySubmit }) {
  const safeAnswer = sanitizeAnswer(answer);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(safeAnswer.likes);
  const [replies, setReplies] = useState(safeAnswer.replies);
  const [areRepliesVisible, setAreRepliesVisible] = useState(
    safeAnswer.replies.length > 0,
  );
  const [isReplyComposerOpen, setIsReplyComposerOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState("");
  const [isReplyFeedbackError, setIsReplyFeedbackError] = useState(false);

  const replyLength = replyText.trim().length;
  const canSendReply = replyLength >= 4 && !isSendingReply;

  const handleLikeClick = () => {
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikeCount((previous) => {
      if (nextLiked) return previous + 1;
      return Math.max(0, previous - 1);
    });

    onLikeToggle?.({
      answerId: safeAnswer.id,
      liked: nextLiked,
      likes: nextLiked ? likeCount + 1 : Math.max(0, likeCount - 1),
    });
  };

  const toggleReplyComposer = () => {
    setIsReplyComposerOpen((previous) => !previous);
    setAreRepliesVisible(true);
  };

  const handleReplySubmit = async () => {
    const trimmedReply = replyText.trim();
    if (trimmedReply.length < 4) {
      setReplyFeedback("Balasan minimal 4 karakter.");
      setIsReplyFeedbackError(true);
      return;
    }

    setIsSendingReply(true);
    const submitResult = await Promise.resolve(
      onReplySubmit?.({ answerId: safeAnswer.id, text: trimmedReply }),
    );
    setIsSendingReply(false);

    if (submitResult?.ok === false) {
      setReplyFeedback(
        submitResult.message || "Balasan belum berhasil dikirim.",
      );
      setIsReplyFeedbackError(true);
      return;
    }

    const nextReply = normalizeReply(
      submitResult?.reply,
      safeAnswer.id,
      trimmedReply,
    );

    setReplies((previous) => [...previous, nextReply]);
    setReplyText("");
    setReplyFeedback("Balasan ditambahkan.");
    setIsReplyFeedbackError(false);
    setAreRepliesVisible(true);
    setIsReplyComposerOpen(false);
  };

  return (
    <article
      className={`rounded-[14px] border bg-white px-7 py-6 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)] ${
        safeAnswer.accent
          ? "border-(--color-primary)"
          : "border-[rgba(206,208,249,0.5)]"
      }`}>
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Avatar alt={safeAnswer.author} highlighted={safeAnswer.accent} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[14px] leading-5 font-bold text-(--color-dark)">
                {safeAnswer.author}
              </p>
              {safeAnswer.badges.map((badge) => (
                <Badge key={`${safeAnswer.id}-${badge}`} type={badge} />
              ))}
            </div>

            <p className="mt-1 text-[12px] leading-4 text-[#6b7280]">
              {safeAnswer.subtitle}
            </p>
            <p className="mt-1 inline-flex items-center gap-1 text-[12px] leading-4 text-[#9ca3af]">
              <Icon icon={Clock3} className="h-4 w-4" />
              {safeAnswer.createdAt}
            </p>
          </div>
        </div>

        <button
          type="button"
          className={`${buttonFx} rounded-full p-1 text-[#9ca3af]`}>
          <Icon icon={EllipsisVertical} className="h-5 w-5" strokeWidth={2} />
        </button>
      </header>

      <div className="mt-4 space-y-3 text-[14px] leading-[22.75px] text-[#374151]">
        {safeAnswer.paragraphs.map((paragraph) => (
          <p key={`${safeAnswer.id}-${paragraph.slice(0, 40)}`}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-5 border-t border-[#e5e7eb] pt-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              aria-pressed={isLiked}
              onClick={handleLikeClick}
              className={`${buttonFx} inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] leading-5 font-semibold ${
                isLiked
                  ? "bg-(--color-primary) text-white"
                  : "bg-[#fef3c7] text-(--color-primary)"
              }`}>
              <Icon icon={ThumbsUp} className="h-5.25 w-5.25" strokeWidth={2} />
              {likeCount}
            </button>

            <button
              type="button"
              aria-label="Balas jawaban"
              onClick={toggleReplyComposer}
              className={`${buttonFx} inline-flex items-center gap-2 rounded-full border border-(--color-secondary) px-4 py-2 text-[14px] leading-5 font-medium text-(--color-dark) hover:bg-(--color-gray)`}>
              <Icon
                icon={MessageCircle}
                className="h-5.25 w-5.25"
                strokeWidth={2}
              />
              Balas
            </button>
          </div>

          <button
            type="button"
            className={`${buttonFx} inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] leading-4 font-medium text-[#9ca3af] hover:text-(--color-dark)`}>
            <Icon icon={Flag} className="h-4 w-4" strokeWidth={2} />
            Laporkan
          </button>
        </div>

        {isReplyComposerOpen ? (
          <div className="mt-3 rounded-[14px] border border-[rgba(206,208,249,0.5)] bg-[#f8fafc] p-3.5">
            <label htmlFor={`${safeAnswer.id}-reply`} className="sr-only">
              Tulis balasan
            </label>
            <textarea
              id={`${safeAnswer.id}-reply`}
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              className="h-24 w-full resize-none rounded-[10px] border border-[rgba(206,208,249,0.5)] bg-white p-3 text-[12px] leading-4 text-(--color-dark) placeholder:text-(--color-secondary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-like-blue)/60"
              placeholder="Tulis balasanmu..."
            />

            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[12px] leading-4 text-(--color-secondary)">
                {replyLength} karakter
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsReplyComposerOpen(false);
                    setReplyText("");
                  }}
                  className={`${buttonFx} rounded-full border border-[#d1d5db] px-3 py-1.5 text-[12px] leading-4 font-medium text-(--color-secondary)`}>
                  Batal
                </button>

                <button
                  type="button"
                  disabled={!canSendReply}
                  onClick={handleReplySubmit}
                  className={`${buttonFx} rounded-full bg-(--color-like-blue) px-3 py-1.5 text-[12px] leading-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-55`}>
                  {isSendingReply ? "Mengirim..." : "Kirim balasan"}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {replyFeedback ? (
          <p
            className={`mt-2 text-[12px] leading-4 ${
              isReplyFeedbackError ? "text-[#b91c1c]" : "text-[#15803d]"
            }`}>
            {replyFeedback}
          </p>
        ) : null}

        {replies.length > 0 ? (
          <>
            <button
              type="button"
              onClick={() => setAreRepliesVisible((previous) => !previous)}
              className={`${buttonFx} mt-3 inline-flex items-center gap-1 text-[12px] leading-4 font-semibold text-[#2563eb] hover:text-[#1d4ed8]`}>
              <Icon icon={MessageCircle} className="h-4 w-4" strokeWidth={2} />
              {areRepliesVisible ? "Sembunyikan" : "Lihat"} {replies.length}{" "}
              balasan
            </button>

            {areRepliesVisible ? (
              <div className="mt-3 space-y-2.5 border-l-2 border-[#e5e7eb] pl-3">
                {replies.map((reply) => (
                  <ReplyItem key={reply.id} reply={reply} />
                ))}
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </article>
  );
}
