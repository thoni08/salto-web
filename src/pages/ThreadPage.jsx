import {
  ArrowRight,
  Clock3,
  Medal,
  MessageCircle,
  PenSquare,
  PlayCircle,
  Search,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { FooterSection } from "./thread-detail/components/FooterSection.jsx";
import { socialLinks } from "./thread-detail/data";

const filters = ["Semua", "Mahasiswa", "Alumni", "Badge Khusus"];

const threadItems = [
  {
    id: "25-885",
    title:
      "Bagaimana cara persiapan technical interview di perusahaan Big Tech (Google, Meta, Apple)?",
    excerpt:
      "Aku lagi cari strategi belajar yang terukur: resource terbaik, pembagian waktu latihan saat kuliah, dan prioritas materi untuk level intern.",
    author: "Kiki Mahendra",
    role: "Mahasiswa IF'27",
    meta: "10 Mar 2026 · 11:02 WIB",
    tags: ["Karir", "Tech", "Magang"],
    stats: { answers: 14, likes: 287 },
  },
  {
    id: "25-886",
    title:
      "Perbedaan culture kerja startup vs korporat untuk fresh graduate, mana yang lebih cocok?",
    excerpt:
      "Pengen denger insight dari alumni yang pernah pindah dari startup ke perusahaan besar. Plus-minus dari sisi learning curve dan work-life balance?",
    author: "Arif Ramadhan",
    role: "Mahasiswa Manajemen",
    meta: "10 Mar 2026 · 12:20 WIB",
    tags: ["Career", "Business"],
    stats: { answers: 21, likes: 193 },
  },
  {
    id: "25-887",
    title:
      "Roadmap data analyst 6 bulan untuk mahasiswa non-IT, mulai dari mana?",
    excerpt:
      "Butuh saran step-by-step dari basic statistik sampai portfolio project yang bisa dipakai apply internship.",
    author: "Nadia Putri",
    role: "Mahasiswa Statistika",
    meta: "10 Mar 2026 · 13:45 WIB",
    tags: ["Data", "Portfolio", "Internship"],
    stats: { answers: 9, likes: 128 },
  },
];

const topAlumni = [
  {
    name: "Ahmad Fauzi, S.Kom",
    subtitle: "Software Engineer at TechNova",
    badge: "Top",
  },
  {
    name: "Siti Aminah, M.B.A",
    subtitle: "HR Manager at MegaBank",
    badge: "Top",
  },
  {
    name: "Reza Rahardian, S.T",
    subtitle: "Project Manager at BuildIt",
    badge: "Top",
  },
];

const upcomingLives = [
  {
    title: "AMA Karier di Big Tech",
    host: "Andri Wirawan",
    time: "Senin · 19:00 WIB",
  },
  {
    title: "Q&A Beasiswa Luar Negeri",
    host: "Anisa Putri",
    time: "Selasa · 16:30 WIB",
  },
];

export default function ThreadPage() {
  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <SiteHeader
        activeHref="/thread"
        authActions={[
          { label: "Masuk", to: "/login", variant: "outline" },
          { label: "Daftar", to: "/login", variant: "solid" },
        ]}
      />

      <main className="mx-auto w-full max-w-316 px-4 pt-6 lg:px-0">
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(0,916px)_320px]">
          <section>
            <header>
              <h1 className="text-[34px] leading-[1.15] font-extrabold tracking-[-0.02em] text-(--color-dark)">
                Diskusi Terbaru
              </h1>

              <label className="mt-4 flex h-11 items-center rounded-2xl border border-(--color-light-blue) bg-white px-4 text-(--color-secondary) shadow-[0_10px_30px_-26px_rgba(37,52,63,0.45)]">
                <Search className="h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari topik, kata kunci, atau alumni..."
                  className="ml-2 w-full bg-transparent text-sm text-(--color-dark) outline-none placeholder:text-(--color-secondary)"
                />
              </label>
            </header>

            <div className="mt-4 flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  type="button"
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    index === 0
                      ? "border-(--color-like-blue) bg-(--color-like-blue) text-white"
                      : "border-(--color-light-blue) bg-white text-(--color-secondary) hover:text-(--color-dark)"
                  }`}>
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              {threadItems.map((thread) => (
                <article
                  key={thread.id}
                  className="rounded-2xl border border-(--color-light-blue) bg-white p-5 shadow-[0_18px_30px_-28px_rgba(37,52,63,0.5)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_40px_-28px_rgba(37,52,63,0.62)]">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-(--color-secondary)">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#eef2ff] px-2 py-1 font-semibold text-(--color-like-blue)">
                      <Sparkles className="h-3.5 w-3.5" />
                      Thread Aktif
                    </span>
                    <span>{thread.meta}</span>
                  </div>

                  <h2 className="mt-3 text-[22px] leading-7 font-bold text-(--color-dark)">
                    <Link
                      to={`/thread/${thread.id}`}
                      className="hover:text-(--color-like-blue)">
                      {thread.title}
                    </Link>
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-(--color-secondary)">
                    {thread.excerpt}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {thread.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#eef2ff] px-3 py-1 text-xs font-semibold text-(--color-secondary)">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#eef1f6] pt-4">
                    <div>
                      <p className="text-sm font-semibold text-(--color-dark)">
                        {thread.author}
                      </p>
                      <p className="text-xs text-(--color-secondary)">
                        {thread.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-(--color-secondary)">
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {thread.stats.answers} jawaban
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {thread.stats.likes}
                      </span>
                      <Link
                        to={`/thread/${thread.id}`}
                        className="inline-flex items-center gap-1 rounded-full bg-(--color-dark) px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90">
                        Lihat Detail <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-(--color-light-blue) bg-white px-6 py-2 text-sm font-semibold text-(--color-dark) transition hover:border-(--color-like-blue) hover:text-(--color-like-blue)">
                Muat Lebih Banyak <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          <aside className="space-y-4">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--color-like-blue) px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_26px_-20px_rgba(79,103,255,0.8)] transition hover:opacity-90">
              <PenSquare className="h-4 w-4" />
              Buat Thread Baru
            </button>

            <section className="rounded-2xl border border-(--color-light-blue) bg-white p-5 shadow-[0_16px_30px_-26px_rgba(37,52,63,0.5)]">
              <header className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-(--color-like-blue)" />
                <h3 className="text-lg font-bold text-(--color-dark)">
                  Top Alumni
                </h3>
              </header>

              <div className="mt-4 space-y-3">
                {topAlumni.map((person) => (
                  <article
                    key={person.name}
                    className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-[#dbe4ff] text-sm font-bold text-(--color-like-blue)">
                      {person.name
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-(--color-dark)">
                        {person.name}
                      </p>
                      <p className="truncate text-xs text-(--color-secondary)">
                        {person.subtitle}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#eef2ff] px-2 py-1 text-[11px] font-semibold text-(--color-like-blue)">
                      {person.badge}
                    </span>
                  </article>
                ))}
              </div>

              <Link
                to="/thread/25-885"
                className="mt-4 inline-flex w-full items-center justify-center text-sm font-semibold text-(--color-like-blue) hover:opacity-80">
                Lihat Semua Alumni
              </Link>
            </section>

            <section className="rounded-2xl border border-(--color-light-blue) bg-white p-5 shadow-[0_16px_30px_-26px_rgba(37,52,63,0.5)]">
              <header className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-(--color-like-blue)" />
                <h3 className="text-lg font-bold text-(--color-dark)">
                  Live Mendatang
                </h3>
              </header>

              <div className="mt-4 space-y-3">
                {upcomingLives.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-xl border border-(--color-light-blue) bg-[#f8f9ff] p-3">
                    <h4 className="text-sm font-semibold text-(--color-dark)">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-(--color-secondary)">
                      {item.host}
                    </p>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs text-(--color-like-blue)">
                      <Clock3 className="h-3.5 w-3.5" /> {item.time}
                    </p>
                  </article>
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
