import {
  ChevronLeft,
  ChevronRight,
  Circle,
  ArrowRight,
  Bookmark,
  Flame,
  Clock3,
  Heart,
  Lightbulb,
  MessageCircle,
  Play,
  Star,
  Sparkles,
  UserCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SiteHeader } from "./components/SiteHeader.jsx";
import { FooterSection } from "./pages/thread-detail/components/FooterSection.jsx";
import { socialLinks } from "./pages/thread-detail/data";

const heroImage =
  "https://www.figma.com/api/mcp/asset/3310478f-2dd4-41c3-8752-373ed3d6ee6f";

const platformStats = [
  {
    label: "Mahasiswa Aktif",
    value: "48.200+",
    description: "dari 120+ perguruan tinggi",
    icon: Users,
    tone: "text-[#4f67ff] bg-[#e8edff] border-[#cfd7ff]",
  },
  {
    label: "Alumni Terverifikasi",
    value: "31.500+",
    description: "di berbagai industri",
    icon: UserCheck,
    tone: "text-[#f59e0b] bg-[#fff4dd] border-[#ffe4a8]",
  },
  {
    label: "Thread Diskusi",
    value: "215.000+",
    description: "Terjawab dalam 24 jam",
    icon: MessageCircle,
    tone: "text-[#10b981] bg-[#e7fcf5] border-[#c7f7e8]",
  },
  {
    label: "Rating Kepuasan",
    value: "48.200+",
    description: "dari 12.000+ Ulasan",
    icon: Star,
    tone: "text-[#fb7185] bg-[#ffe7ee] border-[#ffd2dd]",
  },
];

const trendingThreads = [
  {
    id: "t-1",
    title:
      "Bagaimana cara mendapatkan internship di perusahaan Fortune 500 saat masih semester 5?",
    tags: ["Karier", "Magang", "Business", "Technology"],
    author: "Ridy Mahendra",
    role: "Alumni Google Indonesia",
    reactions: 56,
    views: "3.2k",
    age: "3 jam lalu",
    accent: "from-[#4f67ff] to-[#25343f]",
  },
  {
    id: "t-2",
    title:
      "Perbedaan culture kerja startup vs. korporat: mana yang lebih cocok untuk fresh graduate?",
    tags: ["Career", "Business", "IT"],
    author: "Dr. Sari Wulandari",
    role: "Senior PM Tech Lead",
    reactions: 62,
    views: "5.1k",
    age: "7 jam lalu",
    accent: "from-[#34d399] to-[#0f766e]",
  },
  {
    id: "t-3",
    title:
      "Tips membangun portofolio yang dilirik HR meski belum punya pengalaman kerja",
    tags: ["Portfolio", "Career", "Design"],
    author: "Dewi Pratama",
    role: "Product Ops at Akulaku",
    reactions: 46,
    views: "3.4k",
    age: "12 jam lalu",
    accent: "from-[#fb923c] to-[#ea580c]",
  },
];

const upcomingCards = [
  {
    id: "u-1",
    tone: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
    title: "AMA: Karier di Google sebagai Software Engineer",
    chip: "Tech & IT",
    status: "Segera",
    host: "Budi Santoso",
    org: "SWE L5 @ Google US",
    schedule: "Senin, 15 Mar 2026 • 19:00 WIB",
    participants: "274/450 peserta",
    cta: "Daftar",
  },
  {
    id: "u-2",
    tone: "linear-gradient(135deg, #b91c1c 0%, #991b1b 100%)",
    title: "Q&A Live: Persiapan IELTS untuk Beasiswa Luar Negeri",
    chip: "Scholarship",
    status: "Segera",
    host: "Anisa Putri",
    org: "Rhodes Scholar, Oxford University",
    schedule: "Selasa, 16 Mar 2026 • 16:30 WIB",
    participants: "320/450 peserta",
    cta: "Daftar",
  },
  {
    id: "u-3",
    tone: "linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)",
    title: "Workshop: Membangun Personal Branding di LinkedIn",
    chip: "Career",
    status: "Live sekarang",
    host: "Farhan Hadi",
    org: "HR Director @ Tokopedia",
    schedule: "Jumat, 14 Mar 2026 • 19:00 WIB",
    participants: "188/300 peserta",
    cta: "Bergabung",
  },
  {
    id: "u-4",
    tone: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
    title: "Panel Alumni: Tips Lolos CPNS 2026 Berbagai Kementerian",
    chip: "Government",
    status: "Segera",
    host: "Budi Santoso",
    org: "B. Rumi STAN UI",
    schedule: "Rabu, 19 Mar 2026 • 14:00 WIB",
    participants: "512/1000 peserta",
    cta: "Daftar",
  },
];

function App() {
  return (
    <div className="min-h-screen bg-white text-(--color-dark)">
      <SiteHeader
        activeHref="/"
        authActions={[
          { label: "Masuk", to: "/login", variant: "outline" },
          { label: "Daftar", to: "/signup", variant: "solid" },
        ]}
      />

      <main>
        <section
          className="bg-[#3f4fab]"
          style={{
            backgroundImage:
              "linear-gradient(114deg, #b9c0ea 0%, #3f4fab 58%, #2f3d96 100%)",
          }}>
          <div className="mx-auto grid min-h-198.5 w-full max-w-316 items-center gap-10 px-4 py-14 text-white lg:grid-cols-[480px_1fr] lg:px-0">
            <article>
              <h1 className="text-[48px] leading-none font-extrabold tracking-[-0.02em]">
                Tanya Jawab Mahasiwa & Alumni, Transfer ilmu tanpa batas
              </h1>
              <p className="mt-7 text-[16px] leading-8 text-white/88">
                Platform networking profesional modern untuk mahasiswa dan
                alumni terhubung, berbagi pengetahuan, dan berdiskusi seputar
                jalur karir masa depan.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-6">
                <Link
                  to="/signup"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-(--color-dark) px-7 text-[14px] font-semibold text-white transition hover:opacity-90">
                  Mulai Bertanya <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/thread/25-885"
                  className="inline-flex h-11 items-center rounded-full border border-white/45 bg-white/16 px-7 text-[14px] font-semibold text-white transition hover:bg-white/24">
                  Jelajahi Forum
                </Link>
              </div>

              <div className="mt-7">
                <p className="mb-2 text-[14px] text-white/92">Topik Populer</p>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    "#karier",
                    "#magang",
                    "#beasiswa",
                    "#technology",
                    "#tugas",
                  ].map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-white/35 bg-white/14 px-3 py-1.5 text-[12px] text-white/95">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </article>

            <article className="relative ml-auto w-full max-w-180">
              <div className="overflow-hidden rounded-[18px] border border-white/25 shadow-[0_30px_55px_-26px_rgba(0,0,0,.5)]">
                <img
                  src={heroImage}
                  alt="Sesi diskusi mahasiswa dan alumni"
                  className="h-88 w-full object-cover"
                />
              </div>
              <span className="absolute -left-6 top-14 grid h-13.5 w-13.5 place-items-center rounded-full bg-white text-(--color-primary) shadow-[0_12px_24px_-12px_rgba(0,0,0,.45)]">
                <Lightbulb className="h-5 w-5" />
              </span>
              <span className="absolute -bottom-6 left-[62%] grid h-13.5 w-13.5 place-items-center rounded-full bg-white text-(--color-primary) shadow-[0_12px_24px_-12px_rgba(0,0,0,.45)]">
                <MessageCircle className="h-5 w-5" />
              </span>
            </article>
          </div>
        </section>

        <section className="bg-[#f4f6fb]">
          <div className="mx-auto w-full max-w-316 px-4 py-14 lg:px-0">
            <p className="text-center text-[14px] text-(--color-like-blue) uppercase">
              Dipercaya ribuan pengguna
            </p>
            <h2 className="mt-2 text-center text-[42px] leading-[1.2] font-bold text-(--color-dark)">
              Komunitas yang Terus Berkembang
            </h2>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {platformStats.map((item) => (
                <article
                  key={item.label}
                  className="rounded-xl border border-[#dbe2f1] bg-white px-6 py-7 shadow-[0_16px_28px_-24px_rgba(37,52,63,.55)]">
                  <div
                    className={`mb-3 inline-flex rounded-xl border p-2 ${item.tone}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[42px] leading-10 font-extrabold text-(--color-dark)">
                    {item.value}
                  </p>
                  <p className="mt-2 text-[16px] font-semibold text-(--color-dark)">
                    {item.label}
                  </p>
                  <p className="mt-1 text-[12px] text-(--color-secondary)">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#d8dcef]">
          <div className="mx-auto w-full max-w-316 px-4 py-14 lg:px-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[14px] text-(--color-like-blue)">
                  Diskusi Terkini
                </p>
                <h2 className="mt-1 text-[38px] leading-[1.15] font-bold text-(--color-dark)">
                  Thread Terbaru & Trending
                </h2>
              </div>
              <Link
                to="/thread/25-885"
                className="inline-flex items-center gap-1 text-[14px] font-medium text-(--color-dark) hover:opacity-80">
                Lihat Semua <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-3">
              {trendingThreads.map((thread) => (
                <article
                  key={thread.id}
                  className="rounded-2xl border border-white/85 bg-white p-5 shadow-[0_20px_36px_-28px_rgba(37,52,63,.72)]">
                  <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#ef4444]">
                    <Flame className="h-3.5 w-3.5" /> Trending
                  </div>

                  <h3 className="min-h-18 text-[16px] leading-6 font-semibold text-(--color-dark)">
                    {thread.title}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {thread.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#eef2ff] px-2.5 py-1 text-[11px] text-(--color-secondary)">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-[#eef1f6] pt-4 text-[12px]">
                    <p className="font-semibold text-(--color-dark)">
                      {thread.author}
                    </p>
                    <p className="text-(--color-secondary)">{thread.role}</p>
                    <div className="mt-3 flex items-center gap-4 text-(--color-secondary)">
                      <span className="inline-flex items-center gap-1">
                        <Heart className="h-4 w-4" /> {thread.reactions}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" /> {thread.views}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-4 w-4" /> {thread.age}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f4f6fb]">
          <div className="mx-auto w-full max-w-316 px-4 py-14 lg:px-0">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[14px] text-(--color-like-blue)">
                  Diskusi terkini
                </p>
                <h2 className="mt-1 text-[38px] leading-[1.15] font-bold text-(--color-dark)">
                  Sesi Live Thread Mendatang
                </h2>
              </div>
              <div className="flex items-center gap-2 text-(--color-secondary)">
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full border border-[#d8dcef] bg-white">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-full border border-[#d8dcef] bg-white">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {upcomingCards.map((card) => (
                <article
                  key={card.id}
                  className="overflow-hidden rounded-2xl border border-[#e4eaf7] bg-white shadow-[0_16px_36px_-30px_rgba(37,52,63,.45)]">
                  <div
                    className="p-4 text-white"
                    style={{ backgroundImage: card.tone }}>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5">
                        <Clock3 className="h-3 w-3" /> {card.status}
                      </span>
                      <span className="rounded-full bg-white/20 px-2 py-0.5">
                        {card.chip}
                      </span>
                    </div>
                    <h4 className="mt-2 min-h-12 text-[14px] leading-5 font-bold">
                      {card.title}
                    </h4>
                    <div className="mt-4 flex items-center justify-between text-[11px] text-white/90">
                      <div>
                        <p className="font-semibold">{card.host}</p>
                        <p>{card.org}</p>
                      </div>
                      <button
                        type="button"
                        aria-label="Play preview"
                        className="grid h-8 w-8 place-items-center rounded-full bg-white/20">
                        <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 p-4">
                    <p className="text-[11px] text-(--color-secondary)">
                      {card.schedule}
                    </p>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e8edf8]">
                      <div className="h-full w-3/4 rounded-full bg-(--color-like-blue)" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-(--color-secondary)">
                        {card.participants}
                      </p>
                      <Link
                        to="/signup"
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold text-white ${card.cta === "Bergabung" ? "bg-[#ef4444]" : "bg-(--color-dark)"} hover:opacity-90`}>
                        {card.cta}
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <FooterSection socialLinks={socialLinks} />
    </div>
  );
}

export default App;
