import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock3,
  Info,
  MessageCircle,
  Play,
  Send,
  Star,
  Users,
  Video,
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.jsx";
import { FooterSection } from "./thread-detail/components/FooterSection.jsx";
import { socialLinks } from "./thread-detail/data";
import { LiveChatMessage } from "./live-diskusi/components/index.js";

const initialMessages = [
  {
    initials: "AW",
    name: "Andi Wirawan",
    tag: "HOST",
    color: "#0A2647",
    tone: "host",
    text: "Halo semua! Sesi kita hari ini fokus ke persiapan technical interview. Ada pertanyaan spesifik yang ingin dibahas?",
    time: "19:02",
    likes: 0,
  },
  {
    initials: "DP",
    name: "Dimas P.",
    color: "#3a6ea8",
    tone: "alt",
    text: "Kak, boleh cerita soal OA (Online Assessment) Google? Formatnya seperti apa?",
    time: "19:03",
    likes: 4,
  },
  {
    initials: "RH",
    name: "Rizky H.",
    color: "#6b46c1",
    tone: "default",
    text: "Bagaimana cara memilih bahasa pemrograman saat interview? Apakah ada preferensi dari interviewer?",
    time: "19:04",
    likes: 0,
  },
];

const upcomingSessions = [
  {
    id: "upcoming-1",
    title: "Q&A Live: Persiapan IELTS untuk Beasiswa Luar Negeri",
    host: "Anisa Putri",
    hostRole: "Rhodes Scholar, Oxford University",
    schedule: "Senin, 15 Mar 2026 • 16:00 WIB",
    fill: "from-[#1d4ed8] to-[#1e40af]",
    progress: "w-3/4",
    participants: "320 / 450 peserta",
  },
  {
    id: "upcoming-2",
    title: "AMA: Karier di Google sebagai Software Engineer",
    host: "Budi Santoso",
    hostRole: "SWE L5 @ Google US",
    schedule: "Selasa, 16 Mar 2026 • 19:00 WIB",
    fill: "from-[#1e40af] to-[#1e3a8a]",
    progress: "w-2/3",
    participants: "284 / 500 peserta",
  },
  {
    id: "upcoming-3",
    title: "Panel Alumni: Tips Lolos CPNS 2026 Berbagai Kementerian",
    host: "Nisa Rahma",
    hostRole: "Policy Analyst @ Kemenkeu",
    schedule: "Rabu, 17 Mar 2026 • 14:00 WIB",
    fill: "from-[#dc2626] to-[#b91c1c]",
    progress: "w-4/5",
    participants: "512 / 1000 peserta",
  },
  {
    id: "upcoming-4",
    title: "Bootcamp Live: System Design untuk Entry-Level",
    host: "Fajar Pratama",
    hostRole: "Staff Engineer @ Gojek",
    schedule: "Kamis, 18 Mar 2026 • 20:00 WIB",
    fill: "from-[#0f766e] to-[#115e59]",
    progress: "w-1/2",
    participants: "168 / 350 peserta",
  },
];

export default function LiveDiskusiPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(42 * 60 + 15);
  const [chatCount, setChatCount] = useState(89);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setTimerSeconds((previous) => previous + 1);
    }, 1000);

    const chatId = window.setInterval(() => {
      setChatCount((previous) => previous + (Math.random() < 0.3 ? 1 : 0));
    }, 5000);

    return () => {
      window.clearInterval(timerId);
      window.clearInterval(chatId);
    };
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const timerLabel = useMemo(() => {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, "0")} menit`;
  }, [timerSeconds]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;

    setMessages((previous) => [
      ...previous,
      {
        initials: "KM",
        name: "Kamu",
        color: "#7783d4",
        tone: "default",
        text,
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        likes: 0,
      },
    ]);
    setDraft("");
    setChatCount((previous) => previous + 1);
  };

  return (
    <div className="min-h-screen bg-(--color-gray) text-(--color-dark)">
      <SiteHeader
        activeHref="/live"
        authActions={[
          { label: "Masuk", to: "/login", variant: "outline" },
          { label: "Daftar", to: "/signup", variant: "solid" },
        ]}
      />

      <main>
        <section className="bg-[linear-gradient(111deg,#b7bee8_0%,#2d3d9f_58%,#24317b_100%)]">
          <div className="mx-auto grid w-full max-w-316 gap-8 px-4 py-7 text-white lg:grid-cols-[1fr_381px] lg:px-0">
            <div>
              <div className="mb-4 text-[12px] text-white/80">
                Beranda / Live
              </div>

              <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#ef4444] px-5 py-2 text-[12px] font-bold">
                  <span className="h-2 w-2 rounded-full bg-white" />1 SESI
                  BERLANGSUNG
                </span>
                <span className="inline-flex items-center rounded-full bg-white/25 px-5 py-2 text-[12px] font-semibold text-white">
                  4 Sesi Mendatang
                </span>
              </div>

              <h1 className="max-w-[11ch] text-[52px] leading-14 font-extrabold tracking-[-0.03em]">
                Live Diskusi Bersama Alumni
              </h1>
              <p className="mt-4 max-w-[56ch] text-[14px] leading-6 text-white/85">
                Sesi tanya jawab langsung dengan alumni berpengalaman. Pelajari
                pengalaman nyata, tanyakan pertanyaanmu secara real-time.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 self-end">
              {[
                { icon: Video, value: "12", label: "Sesi bulan ini" },
                { icon: Users, value: "234", label: "Peserta Aktif" },
                { icon: Star, value: "28", label: "Alumni Host" },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <article key={item.label} className="text-center">
                    <div className="mx-auto mb-2.5 grid h-13 w-13 place-items-center rounded-2xl bg-white text-[#f59e0b] shadow-[0_12px_24px_-18px_rgba(0,0,0,.45)]">
                      <ItemIcon className="h-6 w-6" strokeWidth={1.9} />
                    </div>
                    <p className="text-[20px] leading-5 font-semibold">
                      {item.value}
                    </p>
                    <p className="mt-2 text-[12px] text-white/80">
                      {item.label}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-316 px-4 py-7 lg:px-0">
          <div className="flex items-center justify-between">
            <h2 className="inline-flex items-center gap-2 text-[30px] font-bold text-(--color-dark)">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" /> Sedang
              Berlangsung
            </h2>
            <span className="rounded-full bg-[#fee2e2] px-3 py-1 text-[11px] font-bold text-[#ef4444]">
              LIVE NOW
            </span>
          </div>

          <article className="mt-3 rounded-2xl border border-[#e5e7eb] bg-white px-6 py-4 shadow-[0_18px_42px_-34px_rgba(37,52,63,.2)]">
            <header className="flex items-center gap-2 border-b border-[#eef1f6] pb-4 text-[14px] font-semibold text-(--color-dark)">
              <MessageCircle className="h-4 w-4" /> Live Chat
            </header>

            <div
              ref={chatBoxRef}
              className="grid max-h-95 gap-4 overflow-y-auto py-5">
              {messages.map((message, index) => (
                <LiveChatMessage
                  key={`${message.name}-${index}`}
                  message={message}
                  onLike={() =>
                    setMessages((previous) =>
                      previous.map((item, currentIndex) =>
                        currentIndex === index
                          ? { ...item, likes: item.likes + 1 }
                          : item,
                      ),
                    )
                  }
                />
              ))}
            </div>

            <div className="flex items-center gap-3 border-t border-[#eef1f6] pt-4">
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSend();
                }}
                type="text"
                placeholder="Tulis komentar..."
                className="h-12 flex-1 rounded-full border border-[#e3e8f4] bg-[#f8fafc] px-4 text-[14px] outline-none transition focus:border-(--color-like-blue) focus:ring-2 focus:ring-(--color-light-blue)"
              />
              <button
                type="button"
                onClick={handleSend}
                aria-label="Kirim komentar"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-(--color-like-blue) text-white transition hover:opacity-90">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </article>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [Info, "Topik sesi ini", "Technical Interview"],
              [Users, "Peserta aktif", "243 orang"],
              [Clock3, "Waktu berjalan", timerLabel],
              [MessageCircle, "Chat aktif", `${chatCount} pesan`],
            ].map(([icon, label, value]) => {
              const StatIcon = icon;
              return (
                <article
                  key={String(label)}
                  className="flex items-center gap-3 rounded-xl border border-[#e8ecf6] bg-white px-4 py-3">
                  <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#edf1ff] text-(--color-like-blue)">
                    <StatIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] text-(--color-secondary)">
                      {label}
                    </p>
                    <p className="text-[13px] font-semibold text-(--color-dark)">
                      {value}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <h3 className="text-[30px] font-bold text-(--color-dark)">
              Sesi mendatang
            </h3>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {upcomingSessions.map((session) => (
              <article
                key={session.id}
                className="overflow-hidden rounded-2xl border border-[#e4eaf7] bg-white shadow-[0_16px_36px_-30px_rgba(37,52,63,.45)]">
                <div
                  className={`bg-linear-to-br ${session.fill} p-4 text-white`}>
                  <p className="mb-1 text-[11px] font-semibold text-white/85">
                    Live Session
                  </p>
                  <h4 className="min-h-12 text-[14px] leading-5 font-bold">
                    {session.title}
                  </h4>
                  <div className="mt-4 flex items-center justify-between text-[11px] text-white/90">
                    <div>
                      <p className="font-semibold">{session.host}</p>
                      <p>{session.hostRole}</p>
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
                    {session.schedule}
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e8edf8]">
                    <div
                      className={`h-full rounded-full bg-(--color-like-blue) ${session.progress}`}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-(--color-secondary)">
                      {session.participants}
                    </p>
                    <button
                      type="button"
                      className="rounded-full bg-(--color-dark) px-3 py-1 text-[11px] font-semibold text-white hover:opacity-90">
                      Daftar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <FooterSection socialLinks={socialLinks} />
    </div>
  );
}
