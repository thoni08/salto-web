import {
  ArrowRight,
  Pin,
  Flame,
  Clock3,
  Video,
  MessageCircle,
  Users,
  Radio,
  Medal,
  PenSquare,
  Search,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { FooterSection } from "./thread-detail/components/FooterSection.jsx";
import {
  socialLinks,
  threadFilters as filters,
  threadListItems as threadItems,
  topAlumni,
  upcomingLives,
} from "./thread-detail/data";

function getInitials(name) {
  return name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
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

function UpcomingLiveCard({ creator, title, schedule, participants, cta }) {
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
              LIVE
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
            className="h-7 rounded-full bg-(--color-dark) px-3 text-[12px] leading-4 font-semibold text-white transition hover:opacity-90">
            {cta}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ThreadPage() {
  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <SiteHeader
        activeHref="/thread"
        authActions={[
          { label: "Masuk", to: "/login", variant: "outline" },
          { label: "Daftar", to: "/signup", variant: "solid" },
        ]}
      />

      <main className="mx-auto w-full max-w-316 px-4 pt-6 lg:px-0">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,916px)_320px]">
          <section className="h-236.75">
            <header className="h-25">
              <h1 className="text-[38px] leading-[1.15] font-bold text-(--color-dark)">
                Diskusi Terbaru
              </h1>

              <label className="mt-4 flex h-11.5 items-center rounded-[23px] border border-(--color-light-blue) bg-white px-4.5 text-(--color-secondary) shadow-[0_10px_30px_-26px_rgba(37,52,63,0.45)]">
                <Search className="h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari topik, kata kunci, atau alumni..."
                  className="ml-3 w-full bg-transparent text-[14px] text-(--color-dark) outline-none placeholder:text-(--color-secondary)"
                />
              </label>
            </header>

            <div className="mt-6 flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  type="button"
                  className={`inline-flex h-8 items-center rounded-full px-4 text-[14px] leading-5.25 font-medium transition-colors ${
                    index === 0
                      ? "bg-[#25343f] text-white"
                      : "bg-[#f1f5f9] text-[#25343f] hover:bg-[#e2e8f0]"
                  }`}>
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-6 flex h-191.75 flex-col gap-4">
              {threadItems.map((thread, index) => (
                <Link
                  key={thread.id}
                  to={`/thread/${thread.id}`}
                  className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-like-blue)">
                  <article
                    className={`cursor-pointer overflow-hidden rounded-2xl border border-(--color-light-blue) bg-white px-6 py-5 shadow-[0_18px_30px_-28px_rgba(37,52,63,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-28px_rgba(37,52,63,0.62)] ${
                      index === 1 ? "h-57" : "h-56.25"
                    }`}>
                    <div className="flex items-center gap-2.5">
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

                    <div className="mt-4 flex gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#e2e8f0] bg-[#f8fafc] text-[13px] font-bold text-(--color-like-blue)">
                        {getInitials(thread.author)}
                      </div>

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

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-2">
                            {thread.tags.map((tag) => (
                              <span
                                key={tag.label}
                                className={`rounded-full px-2.5 py-1 text-[12px] leading-4 font-medium ${tag.tone}`}>
                                {tag.label}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 text-[14px] leading-5 font-medium text-(--color-secondary)">
                            <span className="inline-flex items-center gap-1.5">
                              <MessageCircle className="h-4 w-4" />
                              {thread.stats.comments}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <ThumbsUp className="h-4 w-4" />
                              {thread.stats.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}

              <button
                type="button"
                className="mt-4 inline-flex h-10.25 w-auto items-center justify-center gap-2.5 self-center rounded-full border border-[#25343f] px-6.25 text-[14px] leading-5 font-semibold text-[#25343f] transition hover:bg-[#f8fafc]">
                Muat Lebih Banyak <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </section>

          <aside className="h-190 space-y-6">
            <button
              type="button"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25343f] px-4 text-[16px] leading-6 font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition hover:bg-[#1f2c35]">
              <PenSquare className="h-5 w-5" />
              Buat Thread Baru
            </button>

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
                  Live Mendatang
                </h3>
              </header>

              <div className="mt-4 h-74 space-y-4 overflow-hidden">
                {upcomingLives.map((item) => (
                  <UpcomingLiveCard
                    key={item.title}
                    creator={item.creator}
                    title={item.title}
                    schedule={item.schedule}
                    participants={item.participants}
                    cta={item.cta}
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
