import {
    ChevronDown,
    Clock3,
    Flame,
    Medal,
    MessageCircle,
    PenSquare,
    Pin,
    Radio,
    Search,
    ThumbsUp,
    Users,
    Video,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader.jsx";
import {
  LIVE_COMING_SOON_LABEL,
  LIVE_FEATURE_ENABLED,
} from "../config/features.js";
import { fetchThreads, mapApiThreadListItem } from "../services/saltoApi.js";
import { getAuthUser } from "../services/authStorage.js";
import {
  Avatar,
  FooterSection,
  ThreadCardSkeleton,
} from "./thread-detail/components";
import {
    threadListItems as fallbackThreadItems,
    socialLinks,
    topAlumni,
    upcomingLives,
} from "./thread-detail/data";

const THREADS_PER_PAGE = 5;

function parseParticipants(participantsLabel) {
  const match = String(participantsLabel).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function getInitials(name) {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatTagDisplay(tagLabel) {
  return String(tagLabel || "")
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function badgeMeta(type) {
  if (type === "top") {
    return { label: "Top", className: "bg-[#fef3c7] text-[#d97706]" };
  }

  if (type === "mentor") {
    return { label: "Mentor", className: "bg-[#eff6ff] text-[#2563eb]" };
  }

  return { label: "Expert", className: "bg-[#f5f3ff] text-[#7c3aed]" };
}

function threadBadgeMeta(type) {
  if (type === "pinned") {
    return {
      icon: Pin,
      className: "bg-[#eff6ff] text-[#155dfc]",
    };
  }

  if (type === "answered") {
    return {
      icon: MessageCircle,
      className: "bg-[#dcfce7] text-[#166534]",
    };
  }

  return {
    icon: Flame,
    className: "bg-[#fef2f2] text-[#ef4444]",
  };
}

function UpcomingLiveCard({
  creator,
  title,
  schedule,
  participants,
  cta,
  isRegistered,
  onToggleRegister,
}) {
  return (
    <article className="h-35 overflow-hidden rounded-[18px] border border-[#ced0f9]/50 bg-white px-4 pt-4.5 pb-4.5 shadow-[0_20px_36px_-30px_rgba(37,52,63,0.46)]">
      <div className="flex h-26 flex-col justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[12px] leading-4 text-[#929292]">
              <Video className="h-4 w-4" />
              <span>{creator}</span>
            </div>
            <span className="rounded-full bg-[#f04343] px-1.75 py-px text-[12px] leading-4 font-bold text-white">
              {LIVE_FEATURE_ENABLED ? "LIVE" : "SOON"}
            </span>
          </div>

          <h4 className="line-clamp-2 text-[12px] leading-[16.8px] font-semibold text-(--color-dark)">
            {title}
          </h4>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1 text-[12px] leading-4 text-(--color-secondary)">
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              <span>{schedule}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#99a1af]">
              <Users className="h-4 w-4" />
              <span>{participants}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={LIVE_FEATURE_ENABLED ? onToggleRegister : undefined}
            disabled={!LIVE_FEATURE_ENABLED}
            className={`h-7 rounded-full px-3 text-[12px] leading-4 font-semibold transition ${
              !LIVE_FEATURE_ENABLED
                ? "cursor-not-allowed border border-[#d8dcef] bg-[#f8fafc] text-(--color-secondary)"
                : isRegistered
                ? "border border-[#25343f] bg-white text-[#25343f] hover:bg-[#f8fafc]"
                : "bg-(--color-dark) text-white hover:opacity-90"
            }`}>
            {!LIVE_FEATURE_ENABLED
              ? LIVE_COMING_SOON_LABEL
              : isRegistered
                ? "Batal"
                : cta}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ThreadPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [visibleCount, setVisibleCount] = useState(THREADS_PER_PAGE);
  const [threadItems, setThreadItems] = useState(fallbackThreadItems);
  const [likedByThread, setLikedByThread] = useState({});
  const [isThreadLoading, setIsThreadLoading] = useState(true);
  const [threadLoadError, setThreadLoadError] = useState("");
  const authUser = useMemo(() => getAuthUser(), []);
  const [liveSessions, setLiveSessions] = useState(() =>
    upcomingLives.map((item, index) => ({
      ...item,
      id: `live-${index + 1}`,
      participantsCount: parseParticipants(item.participants),
      isRegistered: false,
    })),
  );

  useEffect(() => {
    let active = true;

    async function loadThreads() {
      setIsThreadLoading(true);
      setThreadLoadError("");

      try {
        // Fetch threads WITHOUT searchTerm - do filtering client-side instead
        // This allows searching by author name, title, and content
        const response = await fetchThreads({
          page: 1,
          limit: 100,
          searchTerm: "",
          authorType: "",
        });
        if (active) {
          const mappedThreads = Array.isArray(response?.data)
            ? response.data.map((thread, index) =>
                mapApiThreadListItem(thread, index),
              )
            : [];

          setThreadItems(
            mappedThreads.length > 0 ? mappedThreads : [],
          );
        }
      } catch (error) {
        if (active) {
          setThreadItems([]); // Set to empty array on error
          setThreadLoadError(
            error instanceof Error
              ? error.message
              : "Gagal memuat thread dari API.",
          );
        }
      } finally {
        if (active) {
          setIsThreadLoading(false);
        }
      }
    }

    loadThreads();

    return () => {
      active = false;
    };
  }, []);

  const availableTags = useMemo(() => {
    const tagCount = new Map();
    threadItems.forEach((thread) => {
      thread.tags?.forEach((tag) => {
        if (tag.label) {
          tagCount.set(tag.label, (tagCount.get(tag.label) || 0) + 1);
        }
      });
    });
    // Sort by frequency (descending) and take top 6
    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([label]) => label);
  }, [threadItems]);

  const filteredThreads = useMemo(() => {
    let results = threadItems;

    // Filter by search query (API already filtered by searchTerm, but we add client-side author name filtering)
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase();
      results = results.filter((thread) => {
        const authorMatch = thread.author?.toLowerCase().includes(queryLower);
        const titleMatch = thread.title?.toLowerCase().includes(queryLower);
        const excerptMatch = thread.excerpt?.toLowerCase().includes(queryLower);
        return authorMatch || titleMatch || excerptMatch;
      });
    }

    // Filter by selected tag
    if (selectedTag) {
      results = results.filter((thread) =>
        thread.tags?.some((tag) => tag.label === selectedTag)
      );
    }

    return results;
  }, [selectedTag, threadItems, searchQuery]);

  const visibleThreads = useMemo(
    () => filteredThreads.slice(0, visibleCount),
    [filteredThreads, visibleCount],
  );

  const canLoadMore = visibleThreads.length < filteredThreads.length;

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setVisibleCount(THREADS_PER_PAGE);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setVisibleCount(THREADS_PER_PAGE);
  };

  const handleToggleLike = (threadId) => {
    setLikedByThread((previous) => ({
      ...previous,
      [threadId]: !previous[threadId],
    }));
  };

  const handleToggleRegistration = (sessionId) => {
    setLiveSessions((previous) =>
      previous.map((session) => {
        if (session.id !== sessionId) return session;
        const isRegistered = !session.isRegistered;
        const participantsCount = isRegistered
          ? session.participantsCount + 1
          : Math.max(0, session.participantsCount - 1);

        return {
          ...session,
          isRegistered,
          participantsCount,
        };
      }),
    );
  };

  const openThreadDetail = (threadId) => {
    navigate(`/thread/${threadId}`);
  };

  const handleThreadCardKeyDown = (event, threadId) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openThreadDetail(threadId);
  };

  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <SiteHeader
        activeHref="/thread"
        user={authUser}
        authActions={[
          { label: "Masuk", to: "/login", variant: "outline" },
          { label: "Daftar", to: "/signup", variant: "solid" },
        ]}
      />

      <main className="mx-auto w-full max-w-316 px-4 pt-6 lg:px-0">
        <div className="grid min-w-0 items-start gap-7 lg:grid-cols-[minmax(0,916px)_320px]">
          <section className="min-w-0">
            <header className="pt-1 sm:pt-0">
              <h1 className="max-w-180 text-[30px] leading-[1.12] font-bold text-(--color-dark) sm:text-[38px]">
                Diskusi Terbaru
              </h1>

              <label className="mt-4 flex h-11.5 items-center rounded-[23px] border border-(--color-light-blue) bg-white px-4.5 text-(--color-secondary) shadow-[0_10px_30px_-26px_rgba(37,52,63,0.45)]">
                <Search className="h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Cari topik, kata kunci, atau alumni..."
                  className="ml-3 w-full bg-transparent text-[14px] text-(--color-dark) outline-none placeholder:text-(--color-secondary)"
                />
              </label>
            </header>

            <div className="mt-6 overflow-x-auto pb-2">
              <div className="flex flex-nowrap gap-2">
                <button
                  key="all"
                  type="button"
                  onClick={() => setSelectedTag(null)}
                  className={`inline-flex h-8 shrink-0 items-center rounded-full px-4 text-[14px] leading-5.25 font-medium transition-colors ${
                    selectedTag === null
                      ? "bg-[#25343f] text-white"
                      : "bg-[#f1f5f9] text-[#25343f] hover:bg-[#e2e8f0]"
                  }`}>
                  Semua
                </button>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className={`inline-flex h-8 shrink-0 items-center rounded-full px-4 text-[14px] leading-5.25 font-medium transition-colors ${
                      selectedTag === tag
                        ? "bg-[#25343f] text-white"
                        : "bg-[#f1f5f9] text-[#25343f] hover:bg-[#e2e8f0]"
                    }`}>
                    {formatTagDisplay(tag)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {isThreadLoading
                ? [1, 2, 3].map((key) => <ThreadCardSkeleton key={key} />)
                : null}

              {!isThreadLoading && threadLoadError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 text-[13px] text-amber-700">
                  {threadLoadError}
                </div>
              ) : null}

              {!isThreadLoading && visibleThreads.map((thread) => {
                const isLiked = Boolean(likedByThread[thread.id]);
                const likeCount = thread.stats.likes + (isLiked ? 1 : 0);

                return (
                  <article
                    key={thread.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => openThreadDetail(thread.id)}
                    onKeyDown={(event) =>
                      handleThreadCardKeyDown(event, thread.id)
                    }
                    className={`group cursor-pointer overflow-hidden rounded-2xl border border-(--color-light-blue) bg-white px-4 py-4 shadow-[0_18px_30px_-28px_rgba(37,52,63,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-28px_rgba(37,52,63,0.62)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-like-blue) sm:px-6 sm:py-5`}>
                      <div className="flex flex-wrap items-center gap-2.5">
                      {thread.badges.map((badge) => {
                        const meta = threadBadgeMeta(badge.type);
                        const Icon = meta.icon;

                        return (
                          <span
                            key={`${thread.id}-${badge.type}`}
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] leading-4 font-semibold ${meta.className}`}>
                            <Icon className="h-3 w-3" />
                            {badge.label}
                          </span>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-4">
                      <Avatar
                        alt={thread.author}
                        src={thread.authorAvatar}
                        size="lg"
                        className="shrink-0 self-start"
                      />

                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-[14px] leading-5 font-semibold text-(--color-dark)">
                              {thread.author}
                            </p>
                            <span className="rounded-full bg-[#eef2ff] px-2 py-0.5 text-[10px] leading-3.75 font-semibold text-(--color-like-blue)">
                              {thread.roleLabel}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[12px] leading-4 text-(--color-secondary)">
                            <span>{thread.authorMeta}</span>
                            <span className="h-1 w-1 rounded-full bg-(--color-secondary)/50" />
                            <span>{thread.postedAgo}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <h2 className="text-[15px] leading-[21.75px] font-semibold text-(--color-dark) group-hover:text-(--color-like-blue)">
                            {thread.title}
                          </h2>

                          <p className="line-clamp-1 text-[14px] leading-[22.4px] text-(--color-dark)">
                            {thread.excerpt}
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap gap-2">
                            {thread.tags.map((tag) => (
                              <span
                                key={tag.label}
                                className={`rounded-full px-2.5 py-1 text-[12px] leading-4 font-medium ${tag.tone}`}>
                                {formatTagDisplay(tag.label)}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 text-[14px] leading-5 font-medium text-(--color-secondary) sm:shrink-0">
                            <span className="inline-flex items-center gap-1.5">
                              <MessageCircle className="h-4 w-4" />
                              {thread.stats.comments}
                            </span>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleToggleLike(thread.id);
                              }}
                              aria-label={
                                isLiked
                                  ? `Batalkan suka untuk ${thread.title}`
                                  : `Suka thread ${thread.title}`
                              }
                              aria-pressed={isLiked}
                              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 transition ${
                                isLiked
                                  ? "bg-[#eef2ff] text-(--color-like-blue)"
                                  : "text-(--color-secondary) hover:bg-[#f8fafc]"
                              }`}>
                              <ThumbsUp className="h-4 w-4" />
                              {likeCount}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {!isThreadLoading && visibleThreads.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-(--color-light-blue) bg-white px-6 py-8 text-center text-[14px] text-(--color-secondary)">
                  Tidak ada thread yang cocok dengan filter atau pencarian ini.
                </div>
              ) : null}

              {!isThreadLoading ? (
                <button
                  type="button"
                  disabled={!canLoadMore}
                  onClick={() =>
                    setVisibleCount((previous) =>
                      Math.min(
                        previous + THREADS_PER_PAGE,
                        filteredThreads.length,
                      ),
                    )
                  }
                  className="mt-4 inline-flex h-10.25 w-full items-center justify-center gap-2.5 self-center rounded-full border border-[#25343f] px-6.25 text-[14px] leading-5 font-semibold text-[#25343f] transition hover:bg-[#f8fafc] sm:w-auto">
                  Muat Lebih Banyak <ChevronDown className="h-3 w-3" />
                </button>
              ) : null}
            </div>
          </section>

          <aside className="min-w-0 space-y-6">
            <Link
              to="/thread/create"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25343f] px-4 text-[16px] leading-6 font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition hover:bg-[#1f2c35]">
              <PenSquare className="h-5 w-5" />
              Buat Thread Baru
            </Link>

            <section className="h-70.5 rounded-2xl border border-(--color-light-blue) bg-white p-5 shadow-[0_16px_30px_-26px_rgba(37,52,63,0.5)]">
              <header className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-(--color-like-blue)" />
                <h3 className="text-lg font-bold text-(--color-dark)">
                  Top Alumni
                </h3>
              </header>

              <div className="mt-4 space-y-4">
                {topAlumni.map((person) => (
                  <article
                    key={person.name}
                    className="flex h-10 items-center gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-[#dbe2f1] bg-[#f8fafc] text-[12px] font-bold text-(--color-like-blue)">
                      {getInitials(person.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] leading-5 font-medium text-(--color-dark)">
                        {person.name}
                      </p>
                      <p className="truncate text-[12px] leading-4 text-(--color-secondary)">
                        {person.subtitle}
                      </p>
                    </div>
                    <span
                      className={`inline-flex min-w-15 items-center justify-center rounded-md px-2 py-1 text-[11px] font-semibold ${
                        badgeMeta(person.badge).className
                      }`}>
                      {badgeMeta(person.badge).label}
                    </span>
                  </article>
                ))}
              </div>

              <Link
                to="#"
                className="mt-4 inline-flex w-full items-center justify-center text-[13px] font-semibold text-(--color-like-blue) hover:opacity-80">
                Lihat Semua Alumni
              </Link>
            </section>

            <section className="h-96 rounded-2xl border border-(--color-light-blue) bg-white px-5.25 pb-5.25 pt-5.25 shadow-[0_16px_30px_-26px_rgba(37,52,63,0.5)]">
              <header className="flex h-7 items-center gap-2">
                <Radio className="h-5 w-5 text-(--color-like-blue)" />
                <h3 className="text-lg font-bold text-(--color-dark)">
                  {LIVE_FEATURE_ENABLED ? "Live Mendatang" : "Live Coming Soon"}
                </h3>
              </header>

              <div className="mt-4 h-74 space-y-4 overflow-hidden">
                {liveSessions.map((item) => (
                  <UpcomingLiveCard
                    key={item.id}
                    creator={item.creator}
                    title={item.title}
                    schedule={item.schedule}
                    participants={`${item.participantsCount} peserta`}
                    cta={item.cta}
                    isRegistered={item.isRegistered}
                    onToggleRegister={() => handleToggleRegistration(item.id)}
                  />
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      <FooterSection socialLinks={socialLinks} />
    </div>
  );
}
