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
/** @typedef {import("./types").ViewerProfile} ViewerProfile */

const DEFAULT_THREAD_ID = "25-885";

export const threadFilters = ["Semua", "Mahasiswa", "Alumni", "Badge Khusus"];

export const topAlumni = [
  {
    name: "Ahmad Fauzi, S.Kom",
    subtitle: "Software Engineer at TechNova",
    badge: "top",
  },
  {
    name: "Siti Aminah, M.B.A",
    subtitle: "HR Manager at MegaBank",
    badge: "mentor",
  },
  {
    name: "Reza Rahardian, S.T",
    subtitle: "Project Manager at BuildIt",
    badge: "expert",
  },
];

export const upcomingLives = [
  {
    creator: "Andi Wirawan",
    title: "AMA: Karier di Google sebagai Software Engineer",
    schedule: "Sen, 10 Mar · 19:00 WIB",
    participants: "234 peserta",
    cta: "Daftar",
  },
  {
    creator: "Maya Anggraini",
    title: "Workshop: Personal Branding di LinkedIn untuk Mahasiswa",
    schedule: "Rab, 12 Mar · 14:00 WIB",
    participants: "189 peserta",
    cta: "Gabung",
  },
];

const THREAD_LIBRARY = [
  {
    id: "25-885",
    list: {
      id: "25-885",
      badges: [
        { type: "pinned", label: "Disematkan" },
        { type: "trending", label: "Trending" },
      ],
      title:
        "Bagaimana cara persiapan technical interview di perusahaan Big Tech (Google, Meta, Apple)?",
      excerpt:
        "Aku lagi cari strategi belajar yang terukur: resource terbaik, pembagian waktu latihan saat kuliah, dan prioritas materi untuk level intern.",
      author: "Kiki Mahendra",
      roleLabel: "Mahasiswa",
      authorMeta: "Mahasiswa IF'27 · Universitas Indonesia",
      postedAgo: "10 menit lalu",
      tags: [
        { label: "Karir", tone: "bg-[#dcfce7] text-[#166534]" },
        { label: "Tech", tone: "bg-[#dbeafe] text-[#1d4ed8]" },
        { label: "Magang", tone: "bg-[#f3e8ff] text-[#7e22ce]" },
      ],
      stats: { comments: 14, likes: 87 },
    },
    detail: {
      threadHeader: {
        id: "25-885",
        title:
          "Bagaimana cara persiapan technical interview di perusahaan Big Tech (Google, Meta, Apple)?",
        author: "Kiki Mahendra",
        role: "Mahasiswa",
        createdAt: "10 Mar 2026 · 11:02 WIB",
        views: "4.732",
        answers: "14 Jawaban",
      },
      threadBreadcrumbs: [
        "Beranda",
        "Diskusi",
        "Bagaimana cara persiapan technical...",
      ],
      threadCategoryChips: [
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
      ],
      threadIntroParagraphs: [
        "Halo semua, aku mahasiswa yang lagi persiapan technical interview untuk posisi Software Engineer intern/full-time di Big Tech. Aku lagi cari strategi yang terukur agar latihan tidak acak.",
        "Pertanyaan utamaku: resource apa yang paling efektif, bagaimana membagi waktu latihan saat kuliah, dan seberapa dalam harus belajar system design untuk level intern atau junior?",
        "Kalau ada yang sudah pernah lolos proses interview di Google, Meta, atau Apple, boleh share roadmap belajar mingguannya. Terima kasih banyak sebelumnya.",
      ],
      rawAnswers: [
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
          ],
          replies: [],
        },
      ],
      rawContributors: [
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
      ],
      statsMeta: {
        views: "4,732",
        answers: "14",
        upvotes: "712",
        saved: "312 orang",
        followers: "89 orang",
      },
      relatedThreads: [
        "Tips lolos internship di startup unicorn Indonesia",
        "Perbedaan resume format ATS vs Human-readable",
        "Pengalaman OA di Google: tipe soal dan waktu",
        "Bagaimana mempersiapkan behavioral interview STAR",
      ],
    },
  },
  {
    id: "25-886",
    list: {
      id: "25-886",
      badges: [
        { type: "answered", label: "Terjawab" },
        { type: "trending", label: "Trending" },
      ],
      title:
        "Perbedaan culture kerja startup vs korporat untuk fresh graduate, mana yang lebih cocok?",
      excerpt:
        "Pengen denger insight dari alumni yang pernah pindah dari startup ke perusahaan besar. Plus-minus dari sisi learning curve dan work-life balance?",
      author: "Dr. Sari Wulandari",
      roleLabel: "Alumni",
      authorMeta: "Alumni · Senior Data Scientist @ GoTo",
      postedAgo: "45 menit lalu",
      tags: [
        { label: "AI", tone: "bg-[#dcfce7] text-[#166534]" },
        { label: "Karir", tone: "bg-[#dbeafe] text-[#1d4ed8]" },
        { label: "Tech", tone: "bg-[#f3e8ff] text-[#7e22ce]" },
      ],
      stats: { comments: 82, likes: 340 },
    },
    detail: {
      threadHeader: {
        id: "25-886",
        title:
          "Perbedaan culture kerja startup vs korporat untuk fresh graduate, mana yang lebih cocok?",
        author: "Dr. Sari Wulandari",
        role: "Alumni",
        createdAt: "10 Mar 2026 · 12:20 WIB",
        views: "3.148",
        answers: "21 Jawaban",
      },
      threadBreadcrumbs: [
        "Beranda",
        "Diskusi",
        "Perbedaan culture kerja startup...",
      ],
      threadCategoryChips: [
        {
          id: "chip-ai",
          label: "AI",
          tone: "bg-[#dcfce7] text-[#15803d]",
        },
        {
          id: "chip-career",
          label: "Karir",
          tone: "bg-[#dbeafe] text-[#1d4ed8]",
        },
        {
          id: "chip-tech",
          label: "Tech",
          tone: "bg-[#f3e8ff] text-[#7e22ce]",
        },
      ],
      threadIntroParagraphs: [
        "Aku sering dapat pertanyaan dari mahasiswa: lebih baik mulai dari startup yang gerak cepat, atau langsung ke korporat yang prosesnya lebih rapi?",
        "Setiap jalur punya konteks berbeda. Startup biasanya memberi exposure lintas fungsi lebih cepat, sedangkan korporat cenderung kuat di mentoring, proses, dan skala eksekusi.",
        "Boleh share pengalaman nyata kalian terkait growth, mentoring, dan work-life balance agar teman-teman fresh graduate bisa menilai dengan objektif.",
      ],
      rawAnswers: [
        {
          id: "a-25-886-1",
          author: "Bagas Pratama",
          accent: true,
          subtitle: "Product Manager · Shopee",
          createdAt: "10 Mar 2026 · 13:05 WIB",
          badges: ["top", "mentor"],
          likes: 211,
          paragraphs: [
            "Kalau targetmu akselerasi cepat di awal karier, startup bisa jadi tempat bagus karena scope kerja biasanya luas dan kamu belajar lintas domain.",
            "Korporat cocok kalau kamu ingin fondasi proses yang rapi, struktur evaluasi jelas, dan akses ke mentorship yang stabil.",
          ],
          replies: [],
        },
      ],
      rawContributors: [
        {
          id: "c-25-886-1",
          name: "Bagas Pratama",
          role: "Product Manager",
          org: "Shopee",
          badges: ["top", "mentor"],
          stats: { answer: "421", approved: "91%", joined: "2025" },
        },
        {
          id: "c-25-886-2",
          name: "Nadia Rahma",
          role: "People Partner",
          org: "ByteDance",
          badges: ["expert"],
          stats: { answer: "238", approved: "88%", joined: "2025" },
        },
      ],
      statsMeta: {
        views: "3,148",
        answers: "21",
        upvotes: "506",
        saved: "188 orang",
        followers: "73 orang",
      },
      relatedThreads: [
        "Cara memilih first job untuk fresh graduate",
        "Roadmap skill set wajib untuk PM junior",
        "Bagaimana menilai budaya kerja sebelum menerima offer",
      ],
    },
  },
  {
    id: "25-887",
    list: {
      id: "25-887",
      badges: [
        { type: "pinned", label: "Disematkan" },
        { type: "trending", label: "Trending" },
      ],
      title:
        "Roadmap data analyst 6 bulan untuk mahasiswa non-IT, mulai dari mana?",
      excerpt:
        "Butuh saran step-by-step dari basic statistik sampai portfolio project yang bisa dipakai apply internship.",
      author: "Nabila Zahra",
      roleLabel: "Mahasiswa",
      authorMeta: "Mahasiswa Akuntansi'26 · UNDIP",
      postedAgo: "1 jam lalu",
      tags: [
        { label: "Karir", tone: "bg-[#dcfce7] text-[#166534]" },
        { label: "Skripsi", tone: "bg-[#dbeafe] text-[#1d4ed8]" },
        { label: "Riset", tone: "bg-[#f3e8ff] text-[#7e22ce]" },
      ],
      stats: { comments: 24, likes: 156 },
    },
    detail: {
      threadHeader: {
        id: "25-887",
        title:
          "Roadmap data analyst 6 bulan untuk mahasiswa non-IT, mulai dari mana?",
        author: "Nabila Zahra",
        role: "Mahasiswa",
        createdAt: "10 Mar 2026 · 13:45 WIB",
        views: "2.081",
        answers: "9 Jawaban",
      },
      threadBreadcrumbs: [
        "Beranda",
        "Diskusi",
        "Roadmap data analyst 6 bulan...",
      ],
      threadCategoryChips: [
        {
          id: "chip-career",
          label: "Karir",
          tone: "bg-[#dcfce7] text-[#15803d]",
        },
        {
          id: "chip-skripsi",
          label: "Skripsi",
          tone: "bg-[#dbeafe] text-[#1d4ed8]",
        },
        {
          id: "chip-riset",
          label: "Riset",
          tone: "bg-[#f3e8ff] text-[#7e22ce]",
        },
      ],
      threadIntroParagraphs: [
        "Aku berasal dari jurusan non-IT dan ingin pivot ke data analyst dalam waktu 6 bulan. Saat ini masih bingung urutan belajar yang paling efektif.",
        "Aku ingin fokus ke skill yang benar-benar dipakai saat rekrutmen intern/junior: SQL, statistik dasar, visualisasi, dan storytelling dengan data.",
        "Kalau ada yang pernah berhasil transisi dari non-IT ke data role, boleh sharing roadmap mingguan dan contoh portfolio project yang realistis.",
      ],
      rawAnswers: [
        {
          id: "a-25-887-1",
          author: "Reza Rahardian",
          accent: true,
          subtitle: "Senior Data Analyst · Tokopedia",
          createdAt: "10 Mar 2026 · 14:30 WIB",
          badges: ["expert", "top"],
          likes: 165,
          paragraphs: [
            "Fase 1 (minggu 1-4): fokus SQL dasar, statistik deskriptif, dan eksplorasi dataset publik. Jangan langsung lompat ke machine learning.",
            "Fase 2 (minggu 5-10): bangun 2 project end-to-end (analisis churn dan segmentasi user). Publikasikan di GitHub + dashboard sederhana.",
            "Fase 3 (minggu 11-24): latihan case interview, rapikan storytelling, dan minta review portfolio dari alumni data.",
          ],
          replies: [],
        },
      ],
      rawContributors: [
        {
          id: "c-25-887-1",
          name: "Reza Rahardian",
          role: "Senior Data Analyst",
          org: "Tokopedia",
          badges: ["expert", "top"],
          stats: { answer: "364", approved: "90%", joined: "2024" },
        },
      ],
      statsMeta: {
        views: "2,081",
        answers: "9",
        upvotes: "321",
        saved: "141 orang",
        followers: "52 orang",
      },
      relatedThreads: [
        "Belajar SQL dari nol untuk mahasiswa non-IT",
        "Portfolio project data analyst yang disukai recruiter",
        "Tips membuat dashboard yang enak dibaca stakeholder",
      ],
    },
  },
];

function buildStatRows(statsMeta) {
  return [
    {
      id: "s-1",
      icon: Eye,
      label: "Total Dilihat",
      value: statsMeta.views,
      tone: "bg-[rgba(99,102,241,0.09)] text-indigo-600",
    },
    {
      id: "s-2",
      icon: MessageCircle,
      label: "Total Jawaban",
      value: statsMeta.answers,
      tone: "bg-[rgba(37,99,235,0.09)] text-blue-600",
    },
    {
      id: "s-3",
      icon: ThumbsUp,
      label: "Total Upvote",
      value: statsMeta.upvotes,
      tone: "bg-[rgba(245,158,11,0.09)] text-amber-600",
    },
    {
      id: "s-4",
      icon: Bookmark,
      label: "Disimpan oleh",
      value: statsMeta.saved,
      tone: "bg-[rgba(5,150,105,0.09)] text-emerald-600",
    },
    {
      id: "s-5",
      icon: Users,
      label: "Mengikuti thread",
      value: statsMeta.followers,
      tone: "bg-[rgba(124,58,237,0.09)] text-violet-600",
    },
  ];
}

function buildThreadDetailData(entry) {
  const detail = entry.detail;

  return {
    threadHeader: { ...detail.threadHeader },
    threadBreadcrumbs: [...detail.threadBreadcrumbs],
    threadCategoryChips: detail.threadCategoryChips.map((chip) => ({
      ...chip,
    })),
    threadIntroParagraphs: [...detail.threadIntroParagraphs],
    answers: detail.rawAnswers.map((answer, index) =>
      sanitizeAnswer(answer, index),
    ),
    contributors: detail.rawContributors.map((contributor, index) =>
      sanitizeContributor(contributor, index),
    ),
    statRows: buildStatRows(detail.statsMeta),
    relatedThreads: [...detail.relatedThreads],
  };
}

export const threadListItems = THREAD_LIBRARY.map((entry) => ({
  ...entry.list,
}));

export function getThreadDetailData(threadId) {
  const selectedEntry =
    THREAD_LIBRARY.find((entry) => entry.id === threadId) ||
    THREAD_LIBRARY.find((entry) => entry.id === DEFAULT_THREAD_ID);

  return buildThreadDetailData(selectedEntry);
}

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

export const socialLinks = [
  { id: "soc-1", icon: MessageCircle, label: "Community" },
  { id: "soc-2", icon: Share2, label: "Share" },
  { id: "soc-3", icon: Link2, label: "Link" },
  { id: "soc-4", icon: Users, label: "People" },
];

// Backward-compatible exports (default thread) to avoid breaking existing imports.
const defaultThreadData = getThreadDetailData(DEFAULT_THREAD_ID);
export const threadHeader = defaultThreadData.threadHeader;
export const threadBreadcrumbs = defaultThreadData.threadBreadcrumbs;
export const threadCategoryChips = defaultThreadData.threadCategoryChips;
export const threadIntroParagraphs = defaultThreadData.threadIntroParagraphs;
/** @type {Answer[]} */
export const answers = defaultThreadData.answers;
/** @type {Contributor[]} */
export const contributors = defaultThreadData.contributors;
export const statRows = defaultThreadData.statRows;
export const relatedThreads = defaultThreadData.relatedThreads;
