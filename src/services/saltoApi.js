import axios from "axios";
import { getAuthToken } from "./authStorage.js";
import { stripInlineMarkdown } from "../utils/formatText.js";

const DEFAULT_API_BASE_URL = "https://salto-be.aauaah.tech";

function getApiBaseUrl() {
  return import.meta.env.VITE_SALTO_API_URL || DEFAULT_API_BASE_URL;
}

const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menambahkan auth token otomatis
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor untuk handle error response
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request gagal.";
    throw new Error(message);
  },
);

function toNumber(value, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function formatRelativeTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Baru saja";
  }

  const elapsedMinutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60000),
  );

  if (elapsedMinutes < 1) return "Baru saja";
  if (elapsedMinutes < 60) return `${elapsedMinutes} menit lalu`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} jam lalu`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  return `${elapsedDays} hari lalu`;
}

function formatDisplayDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    .replace(",", " ·");
}

function formatJoinedDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  }).format(date);
}

function pickBestAnswerCount(participant) {
  return toNumber(
    participant?.bestAnswerCount ??
      participant?.bestAnswersCount ??
      participant?.totalBestAnswers ??
      0,
    0,
  );
}

function splitParagraphs(content) {
  return String(content || "")
    .split(/\n{2,}/)
    .map((paragraph) => stripInlineMarkdown(paragraph))
    .filter(Boolean);
}

function formatTagLabel(rawLabel) {
  const normalized = String(rawLabel || "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "Topik";
  }

  return normalized
    .split(" ")
    .map((word) => {
      if (!word) return "";
      if (word.length <= 3) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

function makeTagTone(label, index = 0) {
  const normalized = String(label || "").toLowerCase();

  if (/career|karir|job|interview|resume|portfolio/.test(normalized)) {
    return "bg-[#dcfce7] text-[#166534]";
  }

  if (
    /tech|backend|frontend|web|mobile|cloud|stack|database/.test(normalized)
  ) {
    return "bg-[#dbeafe] text-[#1d4ed8]";
  }

  if (/ai|data|analytics|design|product|community/.test(normalized)) {
    return "bg-[#f3e8ff] text-[#7e22ce]";
  }

  const fallbackTones = [
    "bg-[#dcfce7] text-[#166534]",
    "bg-[#dbeafe] text-[#1d4ed8]",
    "bg-[#f3e8ff] text-[#7e22ce]",
    "bg-[#fee2e2] text-[#b91c1c]",
  ];

  return fallbackTones[index % fallbackTones.length];
}

function normalizeRoleLabel(role) {
  const normalized = String(role || "").toLowerCase();

  if (normalized.includes("alumni")) return "Alumni";
  return "Mahasiswa";
}

function buildAuthorMeta(author) {
  const roleLabel = normalizeRoleLabel(author?.role);
  const field = author?.field ? String(author.field).trim() : "";

  if (field) {
    return `${roleLabel} · ${field}`;
  }

  return roleLabel;
}

function buildExcerpt(content) {
  const compactText = String(content || "")
    .replace(/\s+/g, " ")
    .trim();
  const cleanText = stripInlineMarkdown(compactText);

  if (cleanText.length <= 140) {
    return cleanText;
  }

  return `${cleanText.slice(0, 137).trimEnd()}...`;
}

function buildThreadBadges(thread, index = 0) {
  const badges = [];
  const stats = thread?.stats || {};
  const totalViews = toNumber(
    stats.totalViews ?? stats.views ?? stats.viewCount,
    0,
  );
  const totalAnswers = toNumber(
    stats.totalAnswers ?? stats.answers ?? stats.answerCount,
    0,
  );

  if (totalAnswers >= 10) {
    badges.push({ type: "answered", label: "Terjawab" });
  }

  if (totalViews >= 1000) {
    badges.push({ type: "trending", label: "Trending" });
  }

  if (badges.length === 0 && index === 0) {
    badges.push({ type: "pinned", label: "Disematkan" });
  }

  return badges;
}

function buildThreadTags(tags) {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((entry, index) => {
      const tag = entry?.tag || entry;
      const label = formatTagLabel(tag?.name || tag?.label || "Topik");

      return {
        label,
        tone: makeTagTone(label, index),
      };
    })
    .filter((tag) => tag.label);
}

function buildThreadListItem(thread, index = 0) {
  const author = thread?.author || {};
  const stats = thread?.stats || {};
  const totalViews = toNumber(
    stats.totalViews ?? stats.views ?? stats.viewCount,
    0,
  );
  const totalAnswers = toNumber(
    stats.totalAnswers ?? stats.answers ?? stats.answerCount,
    0,
  );

  return {
    id: String(thread?.id ?? index + 1),
    badges: buildThreadBadges(thread, index),
    title: String(thread?.title || "Tanpa Judul"),
    excerpt: buildExcerpt(thread?.content),
    author: author.fullName || author.userName || "Anonim",
    roleLabel: normalizeRoleLabel(author.role),
    authorMeta: buildAuthorMeta(author),
    postedAgo: formatRelativeTime(thread?.createdAt),
    tags: buildThreadTags(thread?.tags),
    stats: {
      comments: totalAnswers,
      likes: Math.max(0, Math.round(totalViews / 25)),
    },
  };
}

function buildThreadStatRows(statsMeta, fallbackRows = []) {
  const totalViews = toNumber(
    statsMeta?.totalViews ?? statsMeta?.views ?? statsMeta?.viewCount,
    0,
  );
  const totalAnswers = toNumber(
    statsMeta?.totalAnswers ?? statsMeta?.answers ?? statsMeta?.answerCount,
    0,
  );
  const totalUpvotes = toNumber(
    statsMeta?.totalUpvotes ?? statsMeta?.upvotes ?? statsMeta?.likes,
    0,
  );
  const totalSaved = toNumber(
    statsMeta?.totalSaves ?? statsMeta?.saved ?? statsMeta?.bookmarks,
    0,
  );
  const totalFollowers = toNumber(
    statsMeta?.followers ?? statsMeta?.following ?? statsMeta?.participants,
    0,
  );

  const fallbackByLabel = new Map(
    fallbackRows.map((row) => [String(row.label || ""), row]),
  );

  return [
    {
      label: "Total Dilihat",
      value:
        totalViews > 0
          ? totalViews.toLocaleString("id-ID")
          : fallbackByLabel.get("Total Dilihat")?.value || "0",
    },
    {
      label: "Total Jawaban",
      value:
        totalAnswers > 0
          ? totalAnswers.toLocaleString("id-ID")
          : fallbackByLabel.get("Total Jawaban")?.value || "0",
    },
    {
      label: "Total Upvote",
      value:
        totalUpvotes > 0
          ? totalUpvotes.toLocaleString("id-ID")
          : fallbackByLabel.get("Total Upvote")?.value || "0",
    },
    {
      label: "Disimpan oleh",
      value:
        totalSaved > 0
          ? `${totalSaved.toLocaleString("id-ID")} orang`
          : fallbackByLabel.get("Disimpan oleh")?.value || "0 orang",
    },
    {
      label: "Mengikuti thread",
      value:
        totalFollowers > 0
          ? `${totalFollowers.toLocaleString("id-ID")} orang`
          : fallbackByLabel.get("Mengikuti thread")?.value || "0 orang",
    },
  ];
}

export function mapApiThreadListItem(thread, index = 0) {
  return buildThreadListItem(thread, index);
}

function buildContributorsFromParticipants(participantSummary = {}) {
  const alumniResponded = participantSummary?.alumniResponded || [];
  if (!Array.isArray(alumniResponded) || alumniResponded.length === 0) {
    return [];
  }

  return alumniResponded.map((participant, index) => {
    const nameValue = participant?.fullName || participant?.userName || "Anonim";
    const roleValue = participant?.role || "Alumni";
    const fieldValue = participant?.field || "Bidang belum tersedia";
    const userNameRaw = participant?.userName
      ? String(participant.userName).trim()
      : "";
    const joinedValue = formatJoinedDate(participant?.createdAt) || "-";
    const totalReplies = toNumber(participant?.totalReplies, 0);
    const bestAnswerCount = pickBestAnswerCount(participant);

    return {
      id: String(participant?.id || `contributor-${index + 1}`),
      name: nameValue,
      role: roleValue,
      org: fieldValue,
      userNameRaw,
      badges: [],
      stats: {
        answer: String(totalReplies),
        approved: String(bestAnswerCount),
        joined: joinedValue,
      },
    };
  });
}

export function mapApiThreadDetail(thread, fallback = {}) {
  if (!thread) {
    return fallback;
  }

  const resolvedThread =
    thread &&
    typeof thread === "object" &&
    "success" in thread &&
    "data" in thread &&
    thread.data &&
    typeof thread.data === "object"
      ? thread.data
      : thread;

  const author = resolvedThread?.author || {};
  const stats = resolvedThread?.stats || {};
  const content = String(resolvedThread?.content || "");
  const title = String(
    resolvedThread?.title || fallback?.threadHeader?.title || "Tanpa Judul",
  );
  const totalViews = toNumber(
    stats.totalViews ?? stats.views ?? stats.viewCount,
    0,
  );
  const totalAnswers = toNumber(
    stats.totalAnswers ?? stats.answers ?? stats.answerCount,
    0,
  );

  const contributorsFromApi = buildContributorsFromParticipants(
    resolvedThread?.participantSummary,
  );

  return {
    ...fallback,
    currentUserSaved: Boolean(resolvedThread?.currentUserSaved),
    threadHeader: {
      ...(fallback.threadHeader || {}),
      id: String(resolvedThread.id ?? fallback.threadHeader?.id ?? ""),
      title,
      author:
        author.fullName ||
        author.userName ||
        fallback.threadHeader?.author ||
        "Anonim",
      role:
        normalizeRoleLabel(author.role) ||
        fallback.threadHeader?.role ||
        "Mahasiswa",
      createdAt:
        formatDisplayDate(resolvedThread.createdAt) ||
        fallback.threadHeader?.createdAt ||
        "",
      views:
        totalViews > 0
          ? totalViews.toLocaleString("id-ID")
          : fallback.threadHeader?.views || "0",
      answers:
        totalAnswers > 0
          ? `${totalAnswers.toLocaleString("id-ID")} Jawaban`
          : fallback.threadHeader?.answers || "0 Jawaban",
    },
    threadBreadcrumbs: [
      "Beranda",
      "Diskusi",
      title.length > 34 ? `${title.slice(0, 31).trimEnd()}...` : title,
    ],
    threadCategoryChips: buildThreadTags(resolvedThread.tags).map(
      (tag, index) => ({
        id: `chip-${resolvedThread.id}-${index}`,
        label: tag.label,
        tone: tag.tone,
      }),
    ),
    threadIntroParagraphs: splitParagraphs(content),
    contributors:
      contributorsFromApi.length > 0
        ? contributorsFromApi
        : fallback.contributors || [],
    statRows: buildThreadStatRows(stats, fallback.statRows || []),
    relatedThreads: fallback.relatedThreads || [],
  };
}

export async function registerUser(payload) {
  return apiClient.post("/api/register", payload);
}

export async function loginUser({ email, password }) {
  return apiClient.post("/api/login", { email, password });
}

export async function fetchUsers({ token, page = 1, limit = 10, search = "" }) {
  const params = {
    page: String(page),
    limit: String(limit),
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  return apiClient.get("/api/users", { params, headers });
}

export async function fetchUsersBySearchTerm(searchTerm, { page = 1, limit = 10 } = {}) {
  const params = {
    page: String(page),
    limit: String(limit),
  };

  if (String(searchTerm || "").trim()) {
    params.searchTerm = String(searchTerm).trim();
  }

  return apiClient.get("/api/users", { params });
}

export async function updateUserProfile(profile, userId = "") {
  const path = userId ? `/api/user/${userId}` : "/api/user";

  // If profile is FormData, send multipart request
  if (typeof FormData !== "undefined" && profile instanceof FormData) {
    return apiClient.request({
      url: path,
      method: "patch",
      data: profile,
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  return apiClient.patch(path, profile);
}

export async function fetchThreads({
  page = 1,
  limit = 100,
  searchTerm = "",
  authorType = "",
} = {}) {
  const params = {
    page: String(page),
    limit: String(limit),
  };

  if (searchTerm.trim()) {
    params.searchTerm = searchTerm.trim();
  }

  if (authorType.trim()) {
    params.authorType = authorType.trim();
  }

  return apiClient.get("/api/threads", { params });
}

export async function fetchThreadById(threadId) {
  return apiClient.get(`/api/threads/${threadId}`);
}

export async function fetchRelatedThreads(threadId) {
  return apiClient.get(`/api/threads/${threadId}/related`);
}

export async function fetchCurrentUser() {
  return apiClient.get("/api/user");
}

export async function followUser(userId) {
  return apiClient.post("/api/user/follow", { userId });
}

export async function unfollowUser(userId) {
  return apiClient.post("/api/user/unfollow", { userId });
}

export async function fetchIsFollowing(userId) {
  return apiClient.get(`/api/user/${userId}/is-following`);
}

export async function postThreadComment(threadId, { content, parentId } = {}) {
  const trimmed = String(content || "").trim();
  if (!trimmed) {
    throw new Error("Konten komentar tidak boleh kosong.");
  }

  const payload = { content: trimmed };
  if (parentId) {
    payload.parentId = parentId;
  }

  return apiClient.post(`/api/threads/${threadId}/comments`, payload);
}

export async function fetchThreadComments(threadId) {
  return apiClient.get(`/api/threads/${threadId}/comments`);
}

export async function saveThread(threadId) {
  return apiClient.patch(`/api/threads/${threadId}/save`);
}

export async function unsaveThread(threadId) {
  return apiClient.delete(`/api/threads/${threadId}/save`);
}

export async function likeComment(commentId) {
  return apiClient.patch(`/api/comments/${commentId}/like`);
}

export async function unlikeComment(commentId) {
  return apiClient.delete(`/api/comments/${commentId}/like`);
}

export async function setBestAnswer(commentId) {
  return apiClient.patch(`/api/comments/${commentId}/best-answer`);
}

export async function deleteComment(commentId) {
  return apiClient.delete(`/api/comments/${commentId}`);
}
