import {
  Bookmark,
  Eye,
  Link2,
  MessageCircle,
  Share2,
  ThumbsUp,
  Users,
} from "lucide-react";
import { sanitizeAnswer, sanitizeContributor } from "./dataGuards";

/** @typedef {import("./types").Answer} Answer */
/** @typedef {import("./types").Contributor} Contributor */
/** @typedef {import("./types").ThreadCategoryChip} ThreadCategoryChip */
/** @typedef {import("./types").ViewerProfile} ViewerProfile */

export const threadHeader = {
  id: "thread-big-tech-001",
  title:
    "Bagaimana cara persiapan technical interview di perusahaan Big Tech (Google, Meta, Apple)?",
  author: "Kiki Mahendra",
  role: "Mahasiswa",
  createdAt: "10 Mar 2026 · 11:02 WIB",
  views: "4.732",
  answers: "14 Jawaban",
};

export const threadBreadcrumbs = [
  "Beranda",
  "Diskusi",
  "Bagaimana cara persiapan technical...",
];

/** @type {ThreadCategoryChip[]} */
export const threadCategoryChips = [
  {
    id: "chip-career",
    label: "Karir",
    tone: "bg-[#dcfce7] text-[#15803d]",
  },
  {
    id: "chip-tech",
    label: "Tech",
    tone: "bg-[#dbeafe] text-[#1d4ed8]",
  },
  {
    id: "chip-internship",
    label: "Magang",
    tone: "bg-[#f3e8ff] text-[#7e22ce]",
  },
];

export const threadIntroParagraphs = [
  "Halo semua, aku mahasiswa yang lagi persiapan technical interview untuk posisi Software Engineer intern/full-time di Big Tech. Aku lagi cari strategi yang terukur agar latihan tidak acak.",
  "Pertanyaan utamaku: resource apa yang paling efektif, bagaimana membagi waktu latihan saat kuliah, dan seberapa dalam harus belajar system design untuk level intern atau junior?",
  "Kalau ada yang sudah pernah lolos proses interview di Google, Meta, atau Apple, boleh share roadmap belajar mingguannya. Terima kasih banyak sebelumnya.",
];

/** @type {ViewerProfile} */
export const currentViewer = {
  name: "Rizky Mahendra",
  role: "Mahasiswa",
  subtitle: "Mahasiswa IF'27 · Universitas Indonesia",
  isAlumni: false,
  alumniRole: "Alumni",
  alumniSubtitle: "Alumni IF'24 · Software Engineer @ Tokopedia",
};

export const answerComposerProfile = {
  name: currentViewer.name,
  role: currentViewer.role,
  subtitle: currentViewer.subtitle,
};

export const answerComposerMinCharacters = 100;

export const answerComposerRestrictionMessage =
  "Platform ini mengutamakan jawaban dari alumni berpengalaman. Kamu bisa bertanya atau menambahkan pertanyaan lewat kolom balasan.";

export const answerComposerTip =
  "Jawaban dengan contoh nyata dari pengalaman pribadi cenderung mendapat lebih banyak upvote dan membantu penanya lebih baik.";

const rawAnswers = [
  {
    id: "a-1",
    author: "Andri Wirawan",
    accent: true,
    subtitle: "Software Engineer L5 · Google, Mountain View, CA",
    createdAt: "10 Mar 2026 · 11:40 WIB",
    badges: ["top", "mentor"],
    likes: 287,
    paragraphs: [
      "Pertanyaan kamu bagus banget karena ini dilema klasik: banyak belajar tapi tidak terstruktur. Untuk internship, targetkan 3 bulan fokus dengan ritme harian yang realistis.",
      "Saran saya: 70% latihan DSA medium-hard, 20% review pattern, 10% mock interview. Yang paling penting bukan jumlah soal, tapi kualitas breakdown problem dan komunikasi solusi.",
      "Untuk behavioral, siapkan cerita STAR dari pengalaman real: organisasi, project, atau kompetisi. Cerita dengan konteks dan impact terukur biasanya lebih menonjol.",
      "Kalau kamu konsisten 2-3 jam per hari dan evaluasi mingguan, peluang lolos interview screening akan naik signifikan.",
    ],
    replies: [
      {
        id: "a-1-r-1",
        author: "Kiki Mahendra",
        role: "Mahasiswa IF'27",
        text: "Makasih banyak kak. Kalau mock interview mulai di bulan keberapa biar efektif?",
        createdAt: "10 Mar 2026 · 12:05 WIB",
        likes: 4,
      },
      {
        id: "a-1-r-2",
        author: "Bagas Pratama",
        role: "Alumni · PM @ Shopee",
        text: "Setuju, kebanyakan orang fokus quantity padahal pattern recognition dan komunikasi jauh lebih penting.",
        createdAt: "10 Mar 2026 · 13:22 WIB",
        likes: 11,
      },
    ],
  },
  {
    id: "a-2",
    author: "Dr. Sari Wulandari",
    accent: false,
    subtitle: "Senior Data Scientist · GoTo · Ex-Meta London",
    createdAt: "10 Mar 2026 · 14:00 WIB",
    badges: ["expert", "top"],
    likes: 184,
    paragraphs: [
      "Kalau kamu tertarik ke role software yang bersinggungan dengan AI, jangan hanya mengejar DSA. Latih juga product thinking dan kemampuan menjelaskan asumsi sebelum coding.",
      "Di interview global company, interviewer menilai cara berpikir end-to-end: klarifikasi requirement, tentukan struktur data, jelaskan complexity, lalu validasi edge case.",
      "Saran tambahan: mulai networking ringan dari sekarang. Informational chat dengan alumni sering membuka insight role yang tidak tertulis di job description.",
    ],
    replies: [
      {
        id: "a-2-r-1",
        author: "Anisa Putri",
        role: "Alumni · PhD @ Oxford",
        text: "Untuk ML system design, buku Designing ML Systems dari Chip Huyen benar-benar membantu.",
        createdAt: "10 Mar 2026 · 15:10 WIB",
        likes: 22,
      },
      {
        id: "a-2-r-2",
        author: "Bagas Pratama",
        role: "Alumni · PM @ Shopee",
        text: "Tambahan kecil: latih communication speed juga, karena di onsite clarity itu sangat menentukan.",
        createdAt: "10 Mar 2026 · 15:30 WIB",
        likes: 9,
      },
    ],
  },
  {
    id: "a-3",
    author: "Anisa Putri",
    accent: false,
    subtitle: "PhD Candidate · Oxford University · Ex-Google Brain",
    createdAt: "10 Mar 2026 · 16:45 WIB",
    badges: ["phd", "expert"],
    likes: 167,
    paragraphs: [
      "Yang sering terlupa: tracking progres belajar. Simpan log soal yang gagal, alasan gagal, dan pattern yang belum kuat agar sesi berikutnya lebih tajam.",
      "Untuk behavioral, hindari jawaban template. Cerita real yang jujur dan punya impact terukur selalu terasa lebih kuat di mata interviewer.",
      "Timeline kamu bagus. Jika konsisten 6 bulan, kamu bisa menutup gap fundamental sekaligus punya cukup simulasi interview sebelum apply.",
    ],
    replies: [
      {
        id: "a-3-r-1",
        author: "Kiki Mahendra",
        role: "Mahasiswa IF'27",
        text: "Noted kak, aku mulai bikin logbook harian dari minggu ini. Makasih banyak insight-nya.",
        createdAt: "10 Mar 2026 · 17:18 WIB",
        likes: 6,
      },
    ],
  },
];

const rawContributors = [
  {
    id: "c-1",
    name: "Andri Wirawan",
    role: "Software Engineer L5",
    org: "Google, Mountain View, CA",
    badges: ["top", "mentor"],
    stats: { answer: "623", approved: "89%", joined: "2026" },
  },
  {
    id: "c-2",
    name: "Dr. Sari Wulandari",
    role: "Senior Data Scientist",
    org: "GoTo · Ex-Meta London",
    badges: ["expert", "top"],
    stats: { answer: "847", approved: "93%", joined: "2026" },
  },
  {
    id: "c-3",
    name: "Anisa Putri",
    role: "PhD Candidate",
    org: "Oxford University · Ex-Google Brain",
    badges: ["phd", "expert"],
    stats: { answer: "541", approved: "88%", joined: "2026" },
  },
];

export const statRows = [
  {
    id: "s-1",
    icon: Eye,
    label: "Total Dilihat",
    value: "4,732",
    tone: "bg-[rgba(99,102,241,0.09)] text-indigo-600",
  },
  {
    id: "s-2",
    icon: MessageCircle,
    label: "Total Jawaban",
    value: "14",
    tone: "bg-[rgba(37,99,235,0.09)] text-blue-600",
  },
  {
    id: "s-3",
    icon: ThumbsUp,
    label: "Total Upvote",
    value: "712",
    tone: "bg-[rgba(245,158,11,0.09)] text-amber-600",
  },
  {
    id: "s-4",
    icon: Bookmark,
    label: "Disimpan oleh",
    value: "312 orang",
    tone: "bg-[rgba(5,150,105,0.09)] text-emerald-600",
  },
  {
    id: "s-5",
    icon: Users,
    label: "Mengikuti thread",
    value: "89 orang",
    tone: "bg-[rgba(124,58,237,0.09)] text-violet-600",
  },
];

export const relatedThreads = [
  "Tips lolos internship di startup unicorn Indonesia",
  "Perbedaan resume format ATS vs Human-readable",
  "Pengalaman OA di Google: tipe soal dan waktu",
  "Bagaimana mempersiapkan behavioral interview STAR",
];

export const socialLinks = [
  { id: "soc-1", icon: MessageCircle, label: "Community" },
  { id: "soc-2", icon: Share2, label: "Share" },
  { id: "soc-3", icon: Link2, label: "Link" },
  { id: "soc-4", icon: Users, label: "People" },
];

/** @type {Answer[]} */
export const answers = rawAnswers.map((answer, index) =>
  sanitizeAnswer(answer, index),
);

/** @type {Contributor[]} */
export const contributors = rawContributors.map((contributor, index) =>
  sanitizeContributor(contributor, index),
);
