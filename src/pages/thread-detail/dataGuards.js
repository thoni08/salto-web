/** @typedef {import("./types").Answer} Answer */
/** @typedef {import("./types").Contributor} Contributor */

const ALLOWED_BADGES = new Set(["top", "mentor", "expert", "phd"]);

function ensureString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function ensureNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function ensureBadges(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((badge) => ALLOWED_BADGES.has(badge));
}

function ensureParagraphs(value) {
  if (!Array.isArray(value)) return ["Konten jawaban belum tersedia."];
  const paragraphs = value
    .filter((item) => typeof item === "string" && item.trim())
    .map((item) => item.trim());
  return paragraphs.length > 0
    ? paragraphs
    : ["Konten jawaban belum tersedia."];
}

function sanitizeReply(reply, answerId, index) {
  const safeReply = reply && typeof reply === "object" ? reply : {};
  return {
    id: ensureString(safeReply.id, `${answerId}-reply-${index + 1}`),
    author: ensureString(safeReply.author, "Pengguna"),
    role: ensureString(safeReply.role, "Member"),
    text: ensureString(safeReply.text, "Balasan belum tersedia."),
    createdAt: ensureString(safeReply.createdAt, "-"),
    likes: ensureNumber(safeReply.likes, 0),
  };
}

/**
 * Normalize answer object so UI doesn't break when fields are missing.
 * @param {Partial<Answer> | null | undefined} answer
 * @param {number} index
 * @returns {Answer}
 */
export function sanitizeAnswer(answer, index = 0) {
  const safeAnswer = answer && typeof answer === "object" ? answer : {};
  const id = ensureString(safeAnswer.id, `answer-${index + 1}`);
  const replies = Array.isArray(safeAnswer.replies)
    ? safeAnswer.replies.map((reply, replyIndex) =>
        sanitizeReply(reply, id, replyIndex),
      )
    : [];

  return {
    id,
    author: ensureString(safeAnswer.author, "Anonim"),
    accent: Boolean(safeAnswer.accent),
    subtitle: ensureString(safeAnswer.subtitle, "Informasi belum tersedia"),
    createdAt: ensureString(safeAnswer.createdAt, "-"),
    badges: ensureBadges(safeAnswer.badges),
    likes: ensureNumber(safeAnswer.likes, 0),
    paragraphs: ensureParagraphs(safeAnswer.paragraphs),
    replies,
  };
}

/**
 * Normalize contributor object so stats and labels always render.
 * @param {Partial<Contributor> | null | undefined} contributor
 * @param {number} index
 * @returns {Contributor}
 */
export function sanitizeContributor(contributor, index = 0) {
  const safeContributor =
    contributor && typeof contributor === "object" ? contributor : {};
  const stats =
    safeContributor.stats && typeof safeContributor.stats === "object"
      ? safeContributor.stats
      : {};

  return {
    id: ensureString(safeContributor.id, `contributor-${index + 1}`),
    name: ensureString(safeContributor.name, "Kontributor"),
    role: ensureString(safeContributor.role, "Role belum tersedia"),
    org: ensureString(safeContributor.org, "Organisasi belum tersedia"),
    badges: ensureBadges(safeContributor.badges),
    stats: {
      answer: ensureString(stats.answer, "0"),
      approved: ensureString(stats.approved, "-"),
      joined: ensureString(stats.joined, "-"),
    },
  };
}
