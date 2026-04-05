import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Clock3,
  Eye,
  Flame,
  GraduationCap,
  Link2,
  MessageCircle,
  PenSquare,
  Share2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useScrollDirection } from "../hooks/useScrollDirection";
import {
  buttonFx,
  linkFx,
  preventPlaceholderClick,
} from "./thread-detail/constants";
import {
  answerComposerMinCharacters,
  answerComposerRestrictionMessage,
  answerComposerTip,
  answers,
  currentViewer,
  contributors,
  relatedThreads,
  socialLinks,
  statRows,
  threadBreadcrumbs,
  threadCategoryChips,
  threadHeader,
  threadIntroParagraphs,
} from "./thread-detail/data";
import { submitThreadAnswer } from "./thread-detail/threadDetailApi";
import {
  AnswerCard,
  AnswerComposerCard,
  Avatar,
  ContributorCard,
  FooterSection,
  Icon,
} from "./thread-detail/components";

const MONTH_INDEX_BY_NAME = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function parseThreadTimestamp(createdAt) {
  const match = createdAt.match(
    /(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+·\s+(\d{2}):(\d{2})/,
  );

  if (!match) return 0;

  const day = Number(match[1]);
  const month = MONTH_INDEX_BY_NAME[match[2]] ?? 0;
  const year = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);

  return new Date(year, month, day, hour, minute).getTime();
}

function sortAnswerList(answerList, sortMode) {
  const sorted = [...answerList];

  sorted.sort((left, right) => {
    if (sortMode === "latest") {
      const latestDiff =
        parseThreadTimestamp(right.createdAt) -
        parseThreadTimestamp(left.createdAt);
      if (latestDiff !== 0) return latestDiff;
      return right.likes - left.likes;
    }

    const popularDiff = right.likes - left.likes;
    if (popularDiff !== 0) return popularDiff;
    return (
      parseThreadTimestamp(right.createdAt) -
      parseThreadTimestamp(left.createdAt)
    );
  });

  return sorted;
}

export default function ThreadDetailPage() {
  const [sortMode, setSortMode] = useState("popular");
  const [viewerIsAlumni, setViewerIsAlumni] = useState(currentViewer.isAlumni);
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const scrollDirection = useScrollDirection();
  const isAuthenticated = !!localStorage.getItem("authToken");

  const viewerProfile = useMemo(
    () => ({
      name: currentViewer.name,
      role: viewerIsAlumni
        ? currentViewer.alumniRole || "Alumni"
        : currentViewer.role,
      subtitle: viewerIsAlumni
        ? currentViewer.alumniSubtitle || currentViewer.subtitle
        : currentViewer.subtitle,
    }),
    [viewerIsAlumni],
  );

  const visibleAnswers = useMemo(
    () => sortAnswerList([...answers, ...submittedAnswers], sortMode),
    [sortMode, submittedAnswers],
  );

  const answerCountLabel = `${visibleAnswers.length} Jawaban`;
  const bestAnswerCount = visibleAnswers.filter(
    (answer) => answer.accent,
  ).length;

  const handleSubmitAnswer = async (content) => {
    if (!viewerIsAlumni) {
      return {
        ok: false,
        message: answerComposerRestrictionMessage,
      };
    }

    const submitResult = await submitThreadAnswer({
      threadId: threadHeader.id,
      content,
      viewer: viewerProfile,
    });

    if (!submitResult.ok || !submitResult.answer) {
      return {
        ok: false,
        message:
          submitResult.message || "Gagal mengirim jawaban. Silakan coba lagi.",
      };
    }

    setSubmittedAnswers((previous) => [...previous, submitResult.answer]);
    setSortMode("latest");

    return {
      ok: true,
      message: submitResult.message || "Jawaban berhasil dikirim.",
    };
  };

  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <header
        className={`sticky z-30 h-16.25 border-b border-(--color-light-blue)/70 bg-(--color-light-blue)/50 backdrop-blur-[6px] transition-all duration-300 ${
          scrollDirection === "down" ? "-top-25" : "top-0"
        }`}>
        <div className="mx-auto flex h-full w-full max-w-316 items-center justify-between gap-4 px-4 lg:px-0">
          <Link to="/" className={`${linkFx} leading-tight`}>
            <p className="text-[20px] tracking-[2px] font-black">
              <span className="text-(--color-primary)">S</span>
              <span className="text-(--color-dark)">ALTO</span>
            </p>
            <p className="text-[10px] leading-4.5 text-(--color-secondary)">
              Let&apos;s Connect, Grow Together
            </p>
          </Link>

          <nav className="hidden items-center gap-5 text-[14px] leading-4.5 md:flex">
            <a
              href="#"
              onClick={preventPlaceholderClick}
              className={`${linkFx} text-(--color-dark) hover:text-(--color-like-blue)`}>
              Beranda
            </a>

            <a
              href="#"
              onClick={preventPlaceholderClick}
              className={`${linkFx} flex flex-col items-center text-(--color-dark) font-bold`}>
              Diskusi
              <span className="mt-0.75 h-0.5 w-13.25 rounded-full bg-(--color-like-blue)" />
            </a>

            <a
              href="#"
              onClick={preventPlaceholderClick}
              className={`${linkFx} inline-flex items-center gap-1.25 text-(--color-dark) hover:text-(--color-like-blue)`}>
              <span className="h-1.75 w-1.75 rounded-full bg-red-500" />
              Live
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={`md:hidden ${buttonFx} rounded-full border border-(--color-dark) px-5 py-2 text-[14px] leading-4.5 text-(--color-dark) hover:bg-(--color-dark) hover:text-white`}>
              Masuk
            </Link>
            {!isAuthenticated ? (
              <Link
                to="/login"
                className={`hidden md:flex ${buttonFx} rounded-full border border-(--color-dark) px-5 py-2 text-[14px] leading-4.5 text-(--color-dark) hover:bg-(--color-dark) hover:text-white`}>
                Masuk
              </Link>
            ) : (
              <a
                href="#"
                className={`hidden md:flex ${buttonFx} rounded-full border border-(--color-dark) px-5 py-2 text-[14px] leading-4.5 text-(--color-dark) hover:bg-(--color-dark) hover:text-white`}>
                Profil
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-316 px-4 pb-12 pt-3.5 lg:px-0">
        <div className="grid items-start gap-3 lg:grid-cols-[minmax(0,912px)_320px]">
          <section className="space-y-3 min-w-0">
            <nav className="flex flex-nowrap items-center gap-1.5 overflow-hidden px-1 text-[13px] md:text-[14px] leading-5 text-(--color-secondary)">
              {threadBreadcrumbs.map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center gap-1.5 ${
                    index === threadBreadcrumbs.length - 1
                      ? "min-w-0 shrink"
                      : "shrink-0"
                  }`}>
                  <span
                    className={`truncate ${
                      index === threadBreadcrumbs.length - 1
                        ? "text-(--color-dark)"
                        : ""
                    }`}>
                    {item}
                  </span>
                  {index < threadBreadcrumbs.length - 1 ? (
                    <span className="shrink-0 text-[10px] md:text-[12px]">
                      /
                    </span>
                  ) : null}
                </div>
              ))}
            </nav>

            <article className="rounded-2xl border border-(--color-like-blue) bg-white px-8 py-5 shadow-[0px_1px_6px_0px_rgba(0,0,0,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f3f4f6] pb-4">
                <div className="flex flex-wrap items-center gap-2 text-[14px] leading-5 text-[#6b7280]">
                  <button
                    type="button"
                    className={`${buttonFx} inline-flex items-center gap-2 rounded-full text-[14px] font-medium text-[#6b7280] hover:text-(--color-dark)`}>
                    <Icon icon={ArrowLeft} className="h-4 w-4" />
                    Kembali ke Diskusi
                  </button>
                </div>

                <button
                  type="button"
                  className={`${buttonFx} inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] font-medium text-(--color-secondary) hover:bg-(--color-gray) hover:text-(--color-dark)`}>
                  <Icon icon={Share2} className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {threadCategoryChips.map((chip) => (
                  <span
                    key={chip.id}
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] leading-4 font-medium ${chip.tone}`}>
                    {chip.label}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1 rounded-full bg-[#fef2f2] px-2 py-0.5 text-[12px] leading-4 font-semibold text-[#fb2c36]">
                  <Icon icon={Flame} className="h-3 w-3" />
                  Trending
                </span>
              </div>

              <h1 className="mt-3 text-[26px] leading-[35.75px] font-extrabold text-[#0a2647]">
                {threadHeader.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Avatar alt={threadHeader.author} />
                <div>
                  <p className="text-[14px] leading-5 font-bold text-(--color-dark)">
                    {threadHeader.author}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#dbeafe] px-2 py-0.5 text-[10px] leading-3.75 font-semibold text-[#1e40af]">
                      <Icon icon={GraduationCap} className="h-3 w-3" />
                      {threadHeader.role}
                    </span>
                    <p className="inline-flex items-center gap-1 text-[12px] leading-4 text-[#9ca3af]">
                      <Icon icon={Clock3} className="h-4 w-4" />
                      {threadHeader.createdAt}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-[14px] leading-[22.75px] text-[#374151]">
                {threadIntroParagraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-[12px] leading-4 text-[#9ca3af]">
                <span className="inline-flex items-center gap-1">
                  <Icon icon={Eye} className="h-4 w-4" />
                  {threadHeader.views}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Icon icon={MessageCircle} className="h-4 w-4" />
                  {answerCountLabel}
                </span>
              </div>
            </article>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-[16px] leading-6 font-bold text-[#101828]">
                  {answerCountLabel}
                </h2>
                {bestAnswerCount > 0 ? (
                  <span className="inline-flex items-center rounded-full bg-[#eff6ff] px-2 py-0.5 text-[12px] leading-4 font-medium text-[#2563eb]">
                    {bestAnswerCount} terbaik
                  </span>
                ) : null}
              </div>

              <div className="inline-flex items-center rounded-full border border-(--color-gray) bg-white p-1">
                <button
                  type="button"
                  onClick={() => setSortMode("popular")}
                  className={`${buttonFx} rounded-full px-4 py-1 text-[12px] leading-4 font-medium ${
                    sortMode === "popular"
                      ? "bg-(--color-dark) text-white"
                      : "text-(--color-secondary) hover:text-(--color-dark)"
                  }`}>
                  Terpopuler
                </button>
                <button
                  type="button"
                  onClick={() => setSortMode("latest")}
                  className={`${buttonFx} rounded-full px-4 py-1 text-[12px] leading-4 font-medium ${
                    sortMode === "latest"
                      ? "bg-(--color-dark) text-white"
                      : "text-(--color-secondary) hover:text-(--color-dark)"
                  }`}>
                  Terbaru
                </button>
              </div>
            </div>

            {visibleAnswers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))}

            <div className="flex items-center gap-2 px-3 pt-1">
              <Icon icon={PenSquare} className="h-6 w-6" />
              <p className="text-[16px] leading-6 font-bold text-[#101828]">
                Tambahkan Jawabanmu
              </p>
            </div>

            <AnswerComposerCard
              profile={viewerProfile}
              tipText={answerComposerTip}
              canAnswer={viewerIsAlumni}
              minCharacters={answerComposerMinCharacters}
              restrictionMessage={answerComposerRestrictionMessage}
              onSubmit={handleSubmitAnswer}
              onRequestAlumniAccess={() => setViewerIsAlumni(true)}
            />
          </section>

          <aside className="space-y-3 lg:sticky lg:top-19.5">
            <section className="rounded-[14px] border border-[#f3f4f6] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-[#101828]">
                <Icon icon={Users} className="h-4 w-4" />
                Alumni yang Menjawab
              </div>

              <div className="space-y-3.5">
                {contributors.map((contributor, idx) => (
                  <div key={contributor.id}>
                    <ContributorCard contributor={contributor} />
                    {idx < contributors.length - 1 ? (
                      <div className="mt-3.5 border-t border-[#e5e7eb]" />
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[14px] border border-[rgba(206,208,249,0.5)] bg-white p-4.5 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-(--color-dark)">
                <Icon icon={BarChart3} className="h-4.5 w-4.5" />
                Statistik Thread
              </div>

              <div className="space-y-2">
                {statRows.map((item) => {
                  const StatIcon = item.icon;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-3">
                        <span
                          className={`inline-flex rounded-[10px] p-1.75 ${item.tone}`}>
                          <Icon icon={StatIcon} className="h-4 w-4" />
                        </span>
                        <span className="text-[12px] leading-4 text-(--color-secondary)">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[12px] leading-4 font-bold text-(--color-dark)">
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[14px] border border-[rgba(206,208,249,0.5)] bg-white p-5.25 shadow-[0px_1px_4px_0px_rgba(0,0,0,0.05)]">
              <div className="mb-3 inline-flex items-center gap-2 text-[14px] leading-5.25 font-bold text-(--color-dark)">
                <Icon icon={Link2} className="h-4.5 w-4.5" />
                Thread Terkait
              </div>

              <ul className="space-y-2">
                {relatedThreads.map((thread) => (
                  <li key={thread}>
                    <a
                      href="#"
                      onClick={preventPlaceholderClick}
                      className={`${linkFx} inline-flex items-start gap-2 text-[12px] leading-4.5 text-(--color-dark) hover:text-(--color-like-blue)`}>
                      <Icon icon={ArrowUpRight} className="mt-0.5 h-4 w-4" />
                      <span>{thread}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </main>

      <FooterSection socialLinks={socialLinks} />
    </div>
  );
}
